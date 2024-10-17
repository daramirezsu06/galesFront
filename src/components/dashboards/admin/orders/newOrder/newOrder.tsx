import newOrder from "@/utils/api/orders/newOrder";
import getProducts from "@/utils/api/products/getProducts";
import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Importación de SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css";

export enum PaymentTerms {
  CASH = "cash", // Pago al contado
  CREDIT = "credit", // Pago a crédito
  INSTALLMENTS = "installments", // Pago en cuotas
  ADVANCE = "advance", // Pago por adelantado
  DEFERRED = "deferred", // Pago diferido (pagar más tarde)
}

interface ProductToBuy {
  id: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
  } | null;
}

const ModalOrder: React.FC<ModalProps> = ({ user, isOpen, onClose }) => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [productstobuy, setProductstobuy] = useState<ProductToBuy[]>([
    {
      id: "",
      quantity: 0,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false); // Para mostrar un estado de carga
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>(
    PaymentTerms.CASH
  ); // Predeterminado en "CASH"

  useEffect(() => {
    const getProductList = async () => {
      if (isOpen) {
        const products = await getProducts("PT,CO");
        setProductList(products);
      }
    };
    getProductList();
  }, [isOpen]);
  useEffect(() => {
    console.log("lo que ingreso al modal", user);
  }, [user]);

  const onAddRef = () => {
    setProductstobuy([
      ...productstobuy,
      {
        id: "",
        quantity: 0,
      },
    ]);
  };

  const handleProductChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newProductList = [...productstobuy];
    newProductList[index].id = event.target.value;
    setProductstobuy(newProductList);
  };

  const handlePaymentTermsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPaymentTerms(event.target.value as PaymentTerms);
  };

  const onSentOrder = async () => {
    setLoading(true); // Comienza el estado de carga

    try {
      await newOrder({
        userId: user?.id,
        products: productstobuy,
        paymentTerms: paymentTerms, // Enviar término de pago seleccionado
      });

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "Pedido enviado con éxito",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        onClose(); // Cierra el modal después de la alerta
      }, 1500);
    } catch (error) {
      // Mostrar alerta de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error ? error.message : "Error al enviar el pedido.",
      });
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-96 lg:w-2/5">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <div>
          <h1 className="text-center text-4xl">Nuevo pedido</h1>
          <h1 className="text-center text-2xl">(cliente: {user?.name})</h1>
        </div>

        <div>
          <div className="flex gap-2 justify-between">
            <h2 className="text-center text-xl">Referencia</h2>
            <h2 className="text-center text-xl">Cantidad</h2>
          </div>

          <div className="flex flex-col gap-2 p-4">
            {productstobuy.map((product, index) => {
              return (
                <div key={index} className="flex gap-4 border-b">
                  <select
                    value={product.id}
                    onChange={(event) => handleProductChange(index, event)}
                    className="flex-grow border rounded p-2">
                    <option value="">Seleccione un producto</option>
                    {productList.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => {
                      const newProductList = [...productstobuy];
                      newProductList[index].quantity =
                        parseInt(e.target.value) || 0;
                      setProductstobuy(newProductList);
                    }}
                    className="border rounded p-2 w-20"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Selección de términos de pago */}
        <div className="mt-4">
          <label className="block text-lg">Términos de pago</label>
          <select
            value={paymentTerms}
            onChange={handlePaymentTermsChange}
            className="border rounded p-2 w-full">
            <option value={PaymentTerms.CASH}>Contado</option>
            <option value={PaymentTerms.CREDIT}>Crédito</option>
            <option value={PaymentTerms.INSTALLMENTS}>Cuotas</option>
            <option value={PaymentTerms.ADVANCE}>Adelantado</option>
            <option value={PaymentTerms.DEFERRED}>Diferido</option>
          </select>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <button onClick={onAddRef} className="bg-indigo-500 rounded-lg p-2">
            Agregar Referencia
          </button>
          <button
            onClick={onSentOrder}
            className={`bg-lime-600 rounded-lg p-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}>
            {loading ? "Enviando..." : "Enviar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalOrder;

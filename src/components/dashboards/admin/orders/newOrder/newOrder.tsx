import newOrder from "@/utils/api/orders/newOrder";
import getProducts from "@/utils/api/products/getProducts";
import { useEffect, useState } from "react";

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
  userId: string;
}

const ModalOrder: React.FC<ModalProps> = ({ userId, isOpen, onClose }) => {
  const [productList, setProductList] = useState<Product[]>([]);

  const [productstobuy, setProductstobuy] = useState<ProductToBuy[]>([
    {
      id: "",
      quantity: 0,
    },
  ]);

  useEffect(() => {
    const getProductList = async () => {
      if (isOpen) {
        const products = await getProducts("PT,CO");
        setProductList(products);
      }
    };
    getProductList();
  }, [isOpen]);

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

  const onSentOrder = () => {
    const responseSendorder = async () => {
      await newOrder({ userId: userId, products: productstobuy });
    };

    const response = responseSendorder();
    console.log(response);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>

        <h1 className=" text-center text-4xl">Nuevo pedido</h1>
        <h1>{userId}</h1>
        <div>
          <div className="flex gap-2 justify-around">
            <h2>Referencia</h2>
            <h2>Cantidad</h2>
          </div>

          <div>
            {productstobuy.map((product, index) => {
              return (
                <div key={index} className="flex gap-2 border-b">
                  <select
                    value={product.id}
                    onChange={(event) => handleProductChange(index, event)}>
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
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={onAddRef} className="bg-indigo-500 rounded-lg p-2">
            Agregar Referencia
          </button>
          <button onClick={onSentOrder} className="bg-lime-600 rounded-lg p-2">
            Enviar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalOrder;

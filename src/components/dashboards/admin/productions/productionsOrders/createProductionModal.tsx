import { useEffect, useState } from "react";
import {
  ProductionOrder,
  ProductionOrderItem,
  ProductionOrderStatus,
} from "../types/productionOrdersType";
import postNewProduction from "@/utils/api/priductions/postProduction";
import getProductionOrders from "@/utils/api/priductions/getProductionsOrder";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  productionOrder: ProductionOrder;
  setProductionOrdes: (orders: ProductionOrder[]) => void;
}

const ModalProduction: React.FC<ModalProps> = ({
  productionOrder,
  isOpen,
  onClose,
  setProductionOrdes,
}) => {
  const [quantityProduced, setQuantityProduced] = useState<number>(
    productionOrder.quantityProduced
  );
  const [productionOrderItems, setProductionOrderItems] = useState<
    ProductionOrderItem[]
  >([]);

  useEffect(() => {
    // Inicializa los ingredientes según la cantidad original de la orden de producción
    setProductionOrderItems(productionOrder.productionOrderItems);
  }, [productionOrder]);
  const ubdateProductionsOrders = async () => {
    const orders = await getProductionOrders();
    setProductionOrdes(orders);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const updatedItems = [...productionOrderItems];
    updatedItems[index].quantityUsed = value;
    setProductionOrderItems(updatedItems);
  };

  const createProduction = async () => {
    const productionItems = productionOrderItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantityUsed,
    }));

    const productionData = {
      productId: productionOrder.product.id, // ID del producto principal
      productionItems,
      quantityProduced,
      productionOrdertId: productionOrder.id,
    };

    try {
      console.log("production order es ", productionData);

      await postNewProduction(productionData); // Llamada al endpoint
      alert("Orden de producción creada con éxito");
      ubdateProductionsOrders();
      onClose(); // Cierra el modal al terminar
    } catch (error) {
      console.error("Error al crear la orden", error);
      alert("Hubo un error al crear la orden");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">
          &times;
        </button>

        <h1 className="text-center text-5xl font-bold mb-6">
          Finalizar Producción
        </h1>

        <div className="mb-6">
          <label className="block mb-2 text-xl font-bold text-gray-800">
            Producto a producir:
          </label>
          <p className="text-lg font-semibold">
            {productionOrder.product.name}
          </p>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-xl font-bold text-gray-800">
            Cantidad Resultante:
          </label>
          <input
            type="number"
            value={quantityProduced}
            onChange={(e) => setQuantityProduced(Number(e.target.value))}
            className="border p-3 rounded-lg w-full text-lg"
            min={1}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ingredientes necesarios:
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <h3 className="font-semibold text-lg">Ingrediente</h3>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Cantidad</h3>
            </div>
          </div>

          {productionOrderItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-lg">{item.product.name}</p>
              </div>
              <div>
                <input
                  className="border p-2 rounded-lg w-full text-lg"
                  type="number"
                  value={item.quantityUsed}
                  onChange={(e) =>
                    handleQuantityChange(index, Number(e.target.value))
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={createProduction}
          className="bg-lime-600 text-white rounded-lg p-4 text-2xl w-full font-semibold">
          Crear orden de producción
        </button>
      </div>
    </div>
  );
};

export default ModalProduction;

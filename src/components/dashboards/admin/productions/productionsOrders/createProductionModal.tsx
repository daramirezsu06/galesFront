import { useEffect, useState } from "react";
import {
  ProductionOrder,
  ProductionOrderItem,
} from "../types/productionOrdersType";
import postNewProduction from "@/utils/api/priductions/postProduction";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  productionOrder: ProductionOrder;
}

const ModalProduction: React.FC<ModalProps> = ({
  productionOrder,
  isOpen,
  onClose,
}) => {
  const [quantityProduced, setQuantityProduced] = useState<number>(
    productionOrder.quantityProduced
  );
  const [productionOrderItems, setProductionOrderItems] = useState<
    ProductionOrderItem[]
  >([]);

  useEffect(() => {
    // Inicializa los ingredientes según la cantidad original de la orden de produccion
    setProductionOrderItems(productionOrder.productionOrderItems);
  }, [productionOrder]);

  const createProduction = async () => {
    const productionItems = productionOrderItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantityUsed,
    }));

    const productionData = {
      productId: productionOrder.product.id, // ID del producto principal
      productionItems,
      quantityProduced,
    };
    const response = await postNewProduction(productionData);
    console.log("productionData", productionData);

    try {
      await postNewProduction(productionData); // Llamada al endpoint
      alert("Orden de producción creada con éxito");
      onClose(); // Cierra la modal al terminar
    } catch (error) {
      console.error("Error al crear la orden", error);
      alert("Hubo un error al crear la orden");
    }
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

        <h1 className="text-center text-4xl mb-4">finalizar Produccion</h1>

        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Producto a producir:
          </label>
          <p className="font-semibold">{productionOrder.product.name}</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Cantidad Resultante:
          </label>
          <input
            type="number"
            value={quantityProduced}
            onChange={(e) => setQuantityProduced(Number(e.target.value))}
            className="border p-2 rounded-lg w-full"
            min={1}
          />
        </div>

        <div className="mb-4">
          <h2 className="font-bold text-gray-700">Ingredientes necesarios:</h2>

          <div className="flex flex-row justify-center">
            <div>
              <h3>ingrediente</h3>
            </div>
            <div>
              <h3>Cantidad</h3>
            </div>
          </div>

          {productionOrderItems.map((item) => (
            <div key={item.id} className="flex flex-row">
              <div>
                <h3>{item.product.name}</h3>
              </div>

              <div>
                <input
                  className=" border-2"
                  type="text"
                  value={item.quantityUsed}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={createProduction}
          className="bg-lime-600 rounded-lg p-2 text-white w-full">
          Crear orden de producción
        </button>
      </div>
    </div>
  );
};

export default ModalProduction;

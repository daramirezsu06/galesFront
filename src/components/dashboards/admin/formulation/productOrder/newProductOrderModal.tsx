import newOrder from "@/utils/api/orders/newOrder";
import { useEffect, useState } from "react";
import { Formulation, FormulationItem } from "../types/typesFormulations";
import postNewProductionOrder from "@/utils/api/priductions/postProductionOrder";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  formulation: Formulation;
}

const ModalProductionOrder: React.FC<ModalProps> = ({
  formulation,
  isOpen,
  onClose,
}) => {
  const [quantityProduced, setQuantityProduced] = useState<number>(
    formulation.presentation
  );
  const [formulationItems, setFormulationItems] = useState<FormulationItem[]>(
    []
  );

  useEffect(() => {
    // Inicializa los ingredientes según la cantidad original de la formulación
    setFormulationItems(formulation.formulationItems);
  }, [formulation]);

  // Función para actualizar la cantidad de producción y ajustar los ingredientes
  const handleQuantityChange = (newQuantity: number) => {
    setQuantityProduced(newQuantity);

    // Actualiza las cantidades de cada ingrediente en base a la nueva cantidad producida
    const updatedFormulationItems = formulation.formulationItems.map(
      (item) => ({
        ...item,
        quantity: (item.quantity / formulation.presentation) * newQuantity, // Ajusta proporcionalmente
      })
    );

    setFormulationItems(updatedFormulationItems);
  };

  // Función para crear la orden de producción
  const createOrder = async () => {
    const productionItems = formulationItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const orderData = {
      productId: formulation.product.id, // ID del producto principal
      productionItems,
      quantityProduced,
    };

    try {
      await postNewProductionOrder(orderData); // Llamada al endpoint
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

        <h1 className="text-center text-4xl mb-4">Nueva Orden de Producción</h1>

        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Producto a producir:
          </label>
          <p className="font-semibold">{formulation.product.name}</p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Cantidad a producir:
          </label>
          <input
            type="number"
            value={quantityProduced}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="border p-2 rounded-lg w-full"
            min={1}
          />
        </div>

        <div className="mb-4">
          <h2 className="font-bold text-gray-700">Ingredientes necesarios:</h2>
          <ul className="list-disc pl-5">
            {formulationItems.map((item) => (
              <li key={item.id}>
                {item.product.name}: {item.quantity.toFixed(2)} unidades
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={createOrder}
          className="bg-lime-600 rounded-lg p-2 text-white w-full">
          Crear orden de producción
        </button>
      </div>
    </div>
  );
};

export default ModalProductionOrder;

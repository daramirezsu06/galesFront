import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

interface InventoryState {
  productId: string;
  date?: string;
  quantity: number;
  reason: string;
  observation: string;
  cost: number;
}

const ModalNewInventory: React.FC<ModalProps> = ({
  productId,
  isOpen,
  onClose,
}) => {
  const initialState: InventoryState = {
    productId: productId,
    date: new Date().toISOString(), // Fecha actual por defecto
    quantity: 0,
    reason: "adjustment", // Valor inicial por defecto
    observation: "",
    cost: 0,
  };

  const possibleReasons = [
    "initial",
    "purchase",
    "supplier_return",
    "adjustment",
    "production",
    "promotion",
    "donation",
    "expired",
  ];

  const [inventoryState, setInventory] = useState<InventoryState>(initialState);

  // Actualizar el estado a medida que el usuario edita los campos
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setInventory((prev) => ({
      ...prev,
      [name]: value, // Usar el name del input para actualizar el estado correspondiente
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = () => {
    console.log("Transacción de inventario:", inventoryState);
    // Aquí podrías enviar la transacción a un servidor o backend, utilizando fetch o axios, etc.
    onClose(); // Cerrar el modal después de la transacción
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
        <h2 className="text-xl font-bold mb-4">
          Nueva Transacción de Inventario
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700">Cantidad</label>
          <input
            type="number"
            name="quantity"
            value={inventoryState.quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Razón</label>
          <select
            name="reason"
            value={inventoryState.reason}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg">
            {possibleReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Observación</label>
          <textarea
            name="observation"
            value={inventoryState.observation}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Costo</label>
          <input
            type="number"
            step="0.01"
            name="cost"
            value={inventoryState.cost}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-lime-600 text-white p-2 rounded-lg">
          Realizar transacción
        </button>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          X
        </button>
      </div>
    </div>
  );
};

export default ModalNewInventory;

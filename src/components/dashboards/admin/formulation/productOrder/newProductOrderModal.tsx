import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Formulation, FormulationItem } from "../types/typesFormulations";
import postNewProductionOrder from "@/utils/api/priductions/postProductionOrder";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleRedirect = () => {
    // Navegación usando next/navigation
    router.push("/dashboard/admin/ordersAndProductions");
  };

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

  // Función para crear la orden de producción con confirmación
  const createOrder = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas crear esta orden de producción?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
          Swal.fire(
            "¡Creada!",
            "La orden de producción ha sido creada con éxito.",
            "success"
          );
          onClose(); // Cierra la modal al terminar
          handleRedirect();
          router.push("/dashboard/admin/ordersAndProductions");
        } catch (error) {
          console.error("Error al crear la orden", error);
          Swal.fire("Error", "Hubo un error al crear la orden.", "error");
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg relative w-3/4 md:w-2/3 lg:w-1/2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl">
          &times;
        </button>

        <h1 className="text-center text-4xl mb-6 font-bold text-gray-800">
          Nueva Orden de Producción
        </h1>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-bold text-gray-700">
            Producto a producir:
          </label>
          <p className="text-xl font-semibold text-gray-800">
            {formulation.product.name}
          </p>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-bold text-gray-700">
            Cantidad a producir:
          </label>
          <input
            type="number"
            value={quantityProduced}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            className="border p-3 rounded-lg w-full text-lg"
            min={1}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700">
            Ingredientes necesarios:
          </h2>
          <ul className="list-disc pl-6 text-lg">
            {formulationItems.map((item) => (
              <li key={item.id} className="text-gray-800">
                {item.product.name}: {item.quantity.toFixed(2)} unidades
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={createOrder}
          className="bg-lime-600 rounded-lg p-3 text-white w-full text-xl font-bold hover:bg-lime-700 transition-colors">
          Crear orden de producción
        </button>
      </div>
    </div>
  );
};

export default ModalProductionOrder;

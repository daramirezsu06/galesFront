import CircleButton from "@/components/shared/CircleButton";
import { EditIcon, TrashIcon } from "@/icons";

import { useEffect, useState } from "react";
import {
  ProductionOrder,
  productionsOrderInitialState,
} from "../types/productionOrdersType";
import ModalProduction from "./createProductionModal";

const useProductionOrders = ({ allproductionOrders }) => {
  const [productionOrdes, setProductionOrdes] = useState<ProductionOrder[]>([]);
  const [currentData, setCurrentData] = useState(productionsOrderInitialState);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedproductionOrder, setSelectedproductionOrder] = useState(
    productionsOrderInitialState
  );

  const handleOpenModal = (row) => {
    setSelectedproductionOrder(row); // Actualiza la fórmula seleccionada con la fila actual
    setModalOpen(true);
    console.log("Row", row);
    console.log("state", selectedproductionOrder);
    console.log(productionOrdes);

    // Abre el modal
  };

  useEffect(() => {
    setProductionOrdes(allproductionOrders);
  }, [allproductionOrders]);

  const columns = [
    {
      name: "Fecha",
      selector: (row) => row.createdAt,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.status,
      sortable: true,
      hide: 768,
    },
    {
      name: "producto",
      selector: (row) => row.product.name,
      sortable: true,
      hide: 768,
    },
    {
      name: "Acciones",
      width: "15%",
      // center: true,
      hide: 768,
      cell: (row) => (
        <div className="flex gap-4">
          <div className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <TrashIcon className="text-red-700 w-6 h-6" />
            </CircleButton>
          </div>
          <div className="btn-icon" onClick={() => handleOpenModal(row)}>
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <EditIcon className="text-blue-700 w-6 h-6" />
            </CircleButton>
          </div>
          <ModalProduction
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            productionOrder={selectedproductionOrder}
          />
        </div>
      ),
    },
  ];

  return {
    productionOrdes,
    currentData,
    columns,
  };
};
export default useProductionOrders;

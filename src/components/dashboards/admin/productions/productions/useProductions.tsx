import CircleButton from "@/components/shared/CircleButton";
import { EditIcon, TrashIcon } from "@/icons";

import { useEffect, useState } from "react";
import {
  ProductionOrder,
  productionsOrderInitialState,
} from "../types/productionOrdersType";
import { Production } from "../types/productionsTypes";

const useProductions = ({ allproductions }) => {
  const [productions, setProductions] = useState<Production[]>([]);
  const [currentData, setCurrentData] = useState(productionsOrderInitialState);

  useEffect(() => {
    setProductions(allproductions);
  }, [allproductions]);

  const columns = [
    {
      name: "Fecha",
      selector: (row) => row.createdAt,
      sortable: true,
    },
    {
      name: "Producido",
      selector: (row) => row.quantityProduced,
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
      name: "totalcost",
      selector: (row) => row.totalCost,
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
          <div className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <EditIcon className="text-blue-700 w-6 h-6" />
            </CircleButton>
          </div>
        </div>
      ),
    },
  ];

  return {
    productions,
    currentData,
    columns,
  };
};
export default useProductions;

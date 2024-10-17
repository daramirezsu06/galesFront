import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { validateForm, validatefield } from "@/components/forms/validateForm";
import { FilterComponent } from "@/components/shared/Table/FilterComponent";
import CircleButton from "@/components/shared/CircleButton";
import { EditIcon, TrashIcon, PlusIcon } from "@/icons";
import { Actions } from "@/utils/types/tables/actions.enum";
import ModalProductionOrder from "../productOrder/newProductOrderModal";
import { Formulation, initialFormulation } from "../types/typesFormulations";

const intialFormulation = {
  id: "",
  presentation: "",
  name: "",
  description: "",
  formulationItems: [
    {
      id: "",
      quantity: "",
      product: {
        id: "",
        name: "",
      },
    },
  ],
};

const useFormulationsTable = (formulations) => {
  const [data, setData] = useState<Formulation[]>([initialFormulation]);
  const [action, setAction] = useState(Actions.VIEW);
  const [currentData, setCurrentData] = useState(intialFormulation);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [rowExpand, setRowExpand] = useState({});
  const [sellers, setSellers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFormulation, setSelectedFormulation] =
    useState(initialFormulation);

  const handleOpenModal = (row) => {
    setSelectedFormulation(row); // Actualiza la fórmula seleccionada con la fila actual
    setModalOpen(true); // Abre el modal
  };

  const filteredItems = data.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const router = useRouter();

  useEffect(() => {
    setData(formulations);
  }, [formulations]);

  const ExpandedComponent = ({ data }) => (
    <div>
      <div className="flex justify-end gap-4 md:hidden">
        <div onClick={() => handleDelete(data)} className="btn-icon">
          <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
            <TrashIcon className="text-red-700 w-6 h-6" />
          </CircleButton>
        </div>
        <div onClick={() => onEdit(data)} className="btn-icon">
          <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
            <EditIcon className="text-blue-700 w-6 h-6" />
          </CircleButton>
        </div>
      </div>
      <div className="bg-gray-300 rounded text-sm m-4 p-4 border border-gray-500 shadow-xl grid grid-cols-1 gap-2 md:grid-cols-2">
        {data.formulationItems.map((item) => {
          return (
            <div key={item.id} className="grid grid-cols-2">
              <span className="font-semibold">{item.product.name}</span>
              <span>{item.quantity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Presentación",
      selector: (row) => row.presentation,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Acciones",
      width: "15%",
      hide: 768,
      cell: (row) => (
        <div className="flex gap-4">
          <div onClick={() => onEdit(row)} className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <EditIcon className="text-blue-700 w-6 h-6" />
            </CircleButton>
          </div>
          <div onClick={() => handleOpenModal(row)} className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <PlusIcon className="text-teal-700 w-6 h-6" />
            </CircleButton>
          </div>
          <ModalProductionOrder
            formulation={selectedFormulation} // Pasar la fórmula seleccionada al modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>
      ),
    },
  ];

  const handleDelete = (row) => {
    setCurrentData(row);
    // Lógica para eliminar
  };

  const onNew = () => {
    setCurrentData(intialFormulation);
    setAction(Actions.NEW);
  };

  const handleCancel = () => {
    setCurrentData(intialFormulation);
    setAction(Actions.VIEW);
  };

  const onEdit = (row) => {
    setCurrentData(row);
    setAction(Actions.EDIT);
  };

  const handleChange = (name, value) => {
    setCurrentData({ ...currentData, [name]: value });

    const error = validatefield(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <>
        <FilterComponent
          onFilter={(e) => setFilterText(e.target.value)}
          onClear={handleClear}
          filterText={filterText}
        />
        <button onClick={onNew}>
          <CircleButton className="ml-4 p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
            <PlusIcon className="w-8 h-8 text-teal-700" />
          </CircleButton>
        </button>
      </>
    );
  }, [filterText, resetPaginationToggle]);

  const expandRow = (bool, row) => {
    bool === true ? setRowExpand(row) : setRowExpand({});
  };

  return {
    data,
    columns,
    action,
    currentData,
    loading,
    rowExpand,
    errors,
    filteredItems,
    subHeaderComponentMemo,
    sellers,
    expandRow,
    ExpandedComponent,
    handleCancel,
    handleChange,
    setAction,
  };
};

export default useFormulationsTable;

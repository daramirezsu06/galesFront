import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { validateForm, validatefield } from "@/components/forms/validateForm";
import { UserStatus, tradStatus } from "@/utils/types/users/userStatus.enum";
import { Role, tradRoles } from "@/utils/types/users/usersRoles";
import { FilterComponent } from "@/components/shared/Table/FilterComponent";
import createUser from "@/utils/api/users/createUser";
import putUser from "@/utils/api/users/putUser";
import CircleButton from "@/components/shared/CircleButton";
import { EditIcon, TrashIcon, PlusIcon } from "@/icons";
import { Actions } from "@/utils/types/tables/actions.enum";

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

const useFormulationsTable = ({ formulations }) => {
  const [data, setData] = useState([]);
  const [action, setAction] = useState(Actions.VIEW);
  const [currentData, setCurrentData] = useState(intialFormulation);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [rowExpand, setRowExpand] = useState({});
  const [sellers, setSellers] = useState([]);

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
      name: "presentacion",
      selector: (row) => row.presentation,
      sortable: true,
    },
    {
      name: "descripcion",
      selector: (row) => row.description,
      sortable: true,
      
    },
    {
      name: "Acciones",
      width: "15%",
      // center: true,
      hide: 768,
      cell: (row) => (
        <div className="flex gap-4">
          <div onClick={() => handleDelete(row)} className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <TrashIcon className="text-red-700 w-6 h-6" />
            </CircleButton>
          </div>
          <div onClick={() => onEdit(row)} className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <EditIcon className="text-blue-700 w-6 h-6" />
            </CircleButton>
          </div>
        </div>
      ),
    },
  ];

  const handleDelete = (row) => {
    setCurrentData(row);
    // verificar Compras!!!!
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

  const handleChange = (name: string, value: string) => {
    console.log("handleChange", name, value);
    setCurrentData({ ...currentData,  [name]: value });

    const error = validatefield(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  // const hadleSubmit = async (e) => {
  //   e.preventDefault();

  //   const errors = validateForm(currentData, "userForm");

  //   const valuesFormError = Object.values(errors);
  //   if (valuesFormError.some((el) => el !== null)) {
  //     setErrors(errors);
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const { id, ...data } = currentData;
  //     delete data.registerDate;
  //     if (action === Actions.NEW) {
  //       await createUser(data);
  //     } else {
  //       await putUser(id, data);
  //     }

  //     router.push("/dashboard/admin/users");
  //     router.refresh();
  //     setAction(Actions.VIEW);
  //     setLoading(false);
  //     await Swal.fire({
  //       icon: "success",
  //       title: `Usuario ${
  //         action === Actions.NEW ? "creado" : "modificado"
  //       } con éxito`,
  //       showConfirmButton: false,
  //       width: "450px",
  //       timer: 1500,
  //     });
  //   } catch (error) {
  //     setLoading(false);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: error,
  //     });
  //   }
  // };

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
          <CircleButton className="ml4 p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
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
  };
};
export default useFormulationsTable;

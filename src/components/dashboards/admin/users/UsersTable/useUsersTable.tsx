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
import { initUser, IUser } from "@/utils/types/users/IUser";
import { geocodeAddress } from "@/components/googleMaps/geocodeAdress/geocode";

const useUsersTable = ({ users }: { users: IUser[] }) => {
  const [data, setData] = useState<IUser[]>([]);
  const [action, setAction] = useState(Actions.VIEW);
  const [currentData, setCurrentData] = useState<IUser>(initUser);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [rowExpand, setRowExpand] = useState({});
  const [sellers, setSellers] = useState<IUser[]>([]);
  const [locationClient, setLocationClient] = useState<any>({
    lat: 6.164671239329751,
    lng: -75.59062236353836,
  });

  const filteredItems = data.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const router = useRouter();

  useEffect(() => {
    setData(users);

    setSellers(
      users.filter(
        (user) => user.role === Role.SELLER || user.role === Role.ADMIN
      )
    );
  }, [users]);

  const ExpandedComponent = ({ data }) => (
    <div>
      <div className="flex justify-start gap-4 md:hidden">
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
        <div className="grid grid-cols-2">
          <span className="font-semibold">Email:</span>
          <span>{data.email}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold">Documento:</span>
          <span>{data.identification}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold">Teléfono:</span>
          <span>{data.phone}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold">Estado:</span>
          <span>{tradStatus(data.status)}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold">Tipo cliente:</span>
          <span>{data.customerType}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold">Fecha registro:</span>
          <span>{data.registerDate.split("T")[0]}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold">Dirección:</span>
          <span>{data.address}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold">Website:</span>
          <span>{data.website}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold">Vendedor:</span>
          <span>
            {sellers.find((seller) => seller.id === data.sellerId)?.name}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-semibold">Imagen:</span>
          <span>{data.image}</span>
        </div>
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
      name: "Teléfono",
      selector: (row) => row.phone,
      sortable: true,
      hide: 768,
    },
    {
      name: "Role",
      selector: (row) => tradRoles(row.role),
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
    setCurrentData(initUser);
    setAction(Actions.NEW);
    console.log("se undio para crear nuevo");
  };

  const handleCancel = () => {
    setCurrentData(initUser);
    setAction(Actions.VIEW);
  };

  const onEdit = (row) => {
    setCurrentData(row);
    if (row.lat && row.lng) {
      setLocationClient({
        lat: Number(row.lat),
        lng: Number(row.lng),
      });
    }

    setAction(Actions.EDIT);
  };

  const handleChange = (name: string, value: string) => {
    console.log("handleChange", name, value);
    setCurrentData({ ...currentData, [name]: value });

    const error = validatefield(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };
  const handleBluerAdress = async (e) => {
    const address = e.target.value;
    const location = await geocodeAddress(address);
    setLocationClient({
      lat: location[0].geometry.location.lat(),
      lng: location[0].geometry.location.lng(),
    });
  };

  const hadleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm(
      { ...currentData, lat: locationClient.lat, lng: locationClient.lng },
      "userForm"
    );

    const valuesFormError = Object.values(errors);
    if (valuesFormError.some((el) => el !== null)) {
      setErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const { id, ...data } = currentData;
      delete data.registerDate;
      if (action === Actions.NEW) {
        console.log("intento crear nuevo");
        console.log(data);

        await createUser({
          ...data,
          lat: locationClient.lat,
          lng: locationClient.lng,
        });
      } else {
        console.log("intento modificar");

        await putUser(id as string, {
          ...data,
          lat: locationClient.lat,
          lng: locationClient.lng,
        });
      }

      router.push("/dashboard/admin/users");
      router.refresh();
      setAction(Actions.VIEW);
      setLoading(false);
      await Swal.fire({
        icon: "success",
        title: `Usuario ${
          action === Actions.NEW ? "creado" : "modificado"
        } con éxito`,
        showConfirmButton: false,
        width: "450px",
        timer: 1500,
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
    }
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
    hadleSubmit,
    handleCancel,
    handleChange,
    handleBluerAdress,
    locationClient,
    setLocationClient,
  };
};
export default useUsersTable;

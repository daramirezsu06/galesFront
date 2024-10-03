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
import GetOrdersByUSer from "@/utils/api/orders/getOrdersByUser";
import { formatDate } from "@/utils/formatDate/formatDate";
import ModalOrder from "../newOrder/newOrder";

const intialUser = {
  address: "",
  email: "",
  id: "",
  identification: "",
  registerDate: null,
  name: "",
  phone: "",
  status: UserStatus.ACTIVE,
  role: Role.CUSTOMER,
  sellerId: "",
};

const useUsersTable = ({ users }) => {
  const [data, setData] = useState([]);
  const [action, setAction] = useState(Actions.VIEW);
  const [currentData, setCurrentData] = useState(intialUser);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [rowExpand, setRowExpand] = useState({});
  const [sellers, setSellers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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

  const ExpandedComponent = ({ data }) => {
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
      const fetchOrdersRecords = async () => {
        const orders = await GetOrdersByUSer({ userId: data.id });
        console.log(orders);
        setOrderHistory(orders);
      };

      fetchOrdersRecords();
    }, [data.id]); // Asegúrate de que se dependa del ID correcto

    return (
      <div>
        <h1>Historial de pedidos</h1>
        <div className="flex justify-start gap-4 md:hidden">
          <div
            onClick={() => {
              setModalOpen(true);
              setSelectedUserId(data.id);
            }}
            className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <PlusIcon className="w-8 h-8 text-teal-700" />
            </CircleButton>
          </div>
          <div className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <EditIcon className="text-blue-700 w-6 h-6" />
            </CircleButton>
          </div>
        </div>

        {orderHistory &&
          orderHistory.map((recod) => (
            <div
              key={recod.id}
              className="bg-gray-300 rounded text-sm m-4 p-4 border border-gray-500 shadow-xl grid grid-cols-1 gap-2 md:grid-cols-3">
              <div className="flex gap-2">
                <samp>Fecha:</samp>
                <span>{formatDate(recod.date)}</span>
              </div>
              <div className="flex gap-2">
                <samp>Estado:</samp>
                <p>{recod.status}</p>
              </div>
              <div className="flex gap-2">
                <samp>Valor:</samp>
                <p>{recod.total}</p>
              </div>
            </div>
          ))}
      </div>
    );
  };

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
      name: "Zona",
      selector: (row) => row.customerType,
      sortable: true,
      hide: 768,
    },
    {
      name: "Dirección",
      selector: (row) => row.address,
      sortable: true,
      hide: 768,
    },
    {
      name: "Acciones",

      cell: (row) => (
        <div className="flex gap-4">
          <div
            onClick={() => {
              setModalOpen(true);
              setSelectedUserId(row.id);
            }}
            className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <PlusIcon className="w-8 h-8 text-teal-700" />
            </CircleButton>
          </div>
          <ModalOrder
            userId={selectedUserId}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>
      ),
    },
  ];

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
        <button onClick={() => setAction(Actions.NEW)}>
          <CircleButton className="ml-4 p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
            <PlusIcon className="w-8 h-8 text-teal-700" />
          </CircleButton>
        </button>
      </>
    );
  }, [filterText, resetPaginationToggle]);

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
    ExpandedComponent,
    setModalOpen,
    setSelectedUserId,
  };
};

export default useUsersTable;

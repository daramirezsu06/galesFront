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
import { User } from "../../users/types/usertype";
import { OrderResponse, PaymentStatus } from "@/utils/types/orders/ordertype";
import putPayentOrder from "@/utils/api/orders/putPaymentOrder";

const initialUser = {
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
  const [data, setData] = useState<User[]>([initialUser]);
  const [action, setAction] = useState(Actions.VIEW);
  const [currentData, setCurrentData] = useState(initialUser);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [rowExpand, setRowExpand] = useState({});
  const [sellers, setSellers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });

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
  useEffect(() => {
    console.log("selecionado print por useefect", selectedUser);
  }, [selectedUser]);

  const ExpandedComponent = ({ data }) => {
    const [orderHistory, setOrderHistory] = useState<OrderResponse[]>([]);

    const fetchOrdersRecords = async () => {
      const orders = await GetOrdersByUSer({ userId: data.id });
      console.log("user", data.id);

      console.log("ordenes optenidas", orders);
      setOrderHistory(orders);
    };

    useEffect(() => {
      fetchOrdersRecords();
    }, [data.id]); // Asegúrate de que se dependa del ID correcto

    const handlePayment = async (orderId) => {
      const response = await putPayentOrder(orderId);
    };

    const confirmPayment = (orderId) => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas notificar que esta orden ha sido pagada?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, notificar pago",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          handlePayment(orderId);
          fetchOrdersRecords(); // Ejecuta la función para cambiar el estado del pago
          Swal.fire(
            "¡Pagada!",
            "El estado del pago ha sido actualizado.",
            "success"
          );
        }
      });
    };

    return (
      <div>
        <h1>Historial de pedidos</h1>
        <div className="flex justify-start gap-4 md:hidden">
          <div
            onClick={() => {
              setModalOpen(true);
              setSelectedUser({ name: data.name, id: data.id });
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
              className="bg-gray-300 rounded text-sm m-4 p-4 border border-gray-500 shadow-xl grid grid-cols-1 gap-2 md:grid-cols-4">
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
              <div className="flex gap-2">
                {recod.PaymentStatus === PaymentStatus.PENDING ? (
                  <button
                    className="bg-red-600 p-2 rounded-md"
                    onClick={() => {
                      confirmPayment(recod.id); // Llama a confirmPayment para mostrar la alerta
                    }}>
                    Cambiar a pagada
                  </button>
                ) : (
                  <>
                    <samp>Estado:</samp>
                    <p className="text-lime-600">{recod.PaymentStatus}</p>
                  </>
                )}
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
              setSelectedUser({ id: row.id, name: row.name });
              console.log({ id: row.id, name: row.name });
            }}
            className="btn-icon">
            <CircleButton className="p-2 rounded-full cursor-pointer hover:bg-purple-950/20">
              <PlusIcon className="w-8 h-8 text-teal-700" />
            </CircleButton>
          </div>
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
    setSelectedUser,
    modalOpen,
    selectedUser,
  };
};

export default useUsersTable;

import getAllUsers from "@/utils/api/users/getAllUsers";
import UsersTable from "./orderTable/orderTable";
import ModalOrder from "./newOrder/newOrder";

const UsersOrders = async () => {
  const users = await getAllUsers();
  return <UsersTable users={users} />;
  
};
export default UsersOrders;

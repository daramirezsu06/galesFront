"use client";
import DataTable from "react-data-table-component";
import { paginationOptions } from "@/utils/types/tables/PaginationOptions";
import useUsersTable from "./useOrderTable";
import ModalOrder from "../newOrder/newOrder";

const UsersTable = ({ users }) => {
  const {
    columns,
    filteredItems,
    subHeaderComponentMemo,
    ExpandedComponent,
    selectedUser,
    setModalOpen,
    modalOpen,
  } = useUsersTable({ users });

  return (
    <div className="overflow-x-auto">
      <DataTable
        title="Usuarios"
        actions={subHeaderComponentMemo}
        columns={columns}
        data={filteredItems}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        pagination
        paginationComponentOptions={paginationOptions}
      />
      <ModalOrder
        user={selectedUser}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default UsersTable;

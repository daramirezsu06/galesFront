"use client";
import DataTable from "react-data-table-component";
import { paginationOptions } from "@/utils/types/tables/PaginationOptions";
import useUsersTable from "./useOrderTable";

const UsersTable = ({ users }) => {
  const {
    columns,
    filteredItems,
    subHeaderComponentMemo,

    ExpandedComponent,
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
    </div>
  );
};

export default UsersTable;

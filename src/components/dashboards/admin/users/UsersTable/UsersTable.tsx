"use client";

import DataTable from "react-data-table-component";
import useUsersTable from "./useUsersTable";
import NewEditUser from "../NewEditUser/NewEditUser";
import { paginationOptions } from "@/utils/types/tables/PaginationOptions";
import { Actions } from "@/utils/types/tables/actions.enum";
import { Map, APIProvider } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import MapCoworking from "@/components/googleMaps/maps/userMaps";

const UsersTable = ({ users }) => {
  const {
    columns,
    action,
    rowExpand,
    currentData,
    loading,
    errors,
    filteredItems,
    subHeaderComponentMemo,
    sellers,
    ExpandedComponent,
    hadleSubmit,
    handleCancel,
    handleChange,
    expandRow,
    handleBluerAdress,
    locationClient,
    setLocationClient,
  } = useUsersTable({ users });
  const MapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  useEffect(() => {
    
  }, []);
  return (
    <>
      {action === Actions.VIEW && (
        <div>
          <DataTable
            //dense
            title="Usuarios"
            actions={subHeaderComponentMemo}
            columns={columns}
            data={filteredItems}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            expandableRowExpanded={(row) => row === rowExpand}
            onRowExpandToggled={(bool, row) => expandRow(bool, row)}
            pagination
            paginationComponentOptions={paginationOptions}
          />
        </div>
      )}
      {(action === Actions.NEW || action === Actions.EDIT) && (
        <NewEditUser
          loading={loading}
          errors={errors}
          handleChange={handleChange}
          currentData={currentData}
          action={action}
          hadleSubmit={hadleSubmit}
          handleCancel={handleCancel}
          sellers={sellers}
          handleBluerAdress={handleBluerAdress}
          locationClient={locationClient}
          setLocationClient={setLocationClient}
        />
      )}
    </>
  );
};
export default UsersTable;

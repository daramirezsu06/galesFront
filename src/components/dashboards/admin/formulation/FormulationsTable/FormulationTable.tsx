"use client";

import DataTable from "react-data-table-component";
import { paginationOptions } from "@/utils/types/tables/PaginationOptions";
import { Actions } from "@/utils/types/tables/actions.enum";
import useFormulationsTable from "./useFormulationTable";
import NewFormulation from "../NewEditUser/NewFormulation";

const FormulationTable = ({ formulations, productsList }) => {
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
    handleCancel,
    handleChange,
    expandRow,
  } = useFormulationsTable(formulations);

  return (
    <>
      {action === Actions.VIEW && (
        <DataTable
          title="Formulaciones"
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
      )}
      {(action === Actions.NEW || action === Actions.EDIT) && (
        <NewFormulation
          loading={loading}
          errors={errors}
          handleChange={handleChange}
          currentData={currentData}
          productsList={productsList}
          action={action}
          handleSubmit={() => {
            console.log("Submitting form");
          }}
          handleCancel={handleCancel}
          sellers={sellers}
        />
      )}
    </>
  );
};

export default FormulationTable;

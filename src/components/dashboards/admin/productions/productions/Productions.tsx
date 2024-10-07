
import DataTable from "react-data-table-component";
// import { TableLoader } from '@/components/shared/Table/TableLoader';

import useProductionOrders from "./useProductions";

const Productions = ({ allproductions }) => {
  const { productions, columns } = useProductionOrders({
    allproductions,
  });

  return (
    <>
      <DataTable
        dense
        title="Atributos"
        columns={columns}
        data={productions}
        expandableRows
        // progressPending={pending}
        // progressComponent={<TableLoader />}
        // expandableRowsComponent={ExpandedComponent}
        pagination
      />
    </>
  );
};
export default Productions;

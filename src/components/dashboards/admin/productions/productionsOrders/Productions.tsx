
import DataTable from "react-data-table-component";
// import { TableLoader } from '@/components/shared/Table/TableLoader';

import useProductionOrders from "./useProductions";

const ProductionOrders = ({ allproductionOrders }) => {
  const { productionOrdes, columns, } = useProductionOrders({
    allproductionOrders,
  });

  return (
    <>
      <DataTable
        dense
        title="Atributos"
        columns={columns}
        data={productionOrdes}
        expandableRows
        // progressPending={pending}
        // progressComponent={<TableLoader />}
        // expandableRowsComponent={ExpandedComponent}
        pagination
      />
    </>
  );
};
export default ProductionOrders;

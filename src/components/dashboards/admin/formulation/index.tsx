import getAllFormulations from "@/utils/api/formulations/getAllFromulations";
import FormulationTable from "./FormulationsTable/FormulationTable";
import getProducts from "@/utils/api/products/getProducts";

const FormulationsPage = async () => {
  const formulations = await getAllFormulations();
  const productsList = await getProducts();
  return (
    <div>
      <FormulationTable
        formulations={formulations}
        productsList={productsList}
      />
    </div>
  );
};
export default FormulationsPage;

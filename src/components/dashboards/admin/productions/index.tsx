import getProductions from "@/utils/api/priductions/getProductions";
import getProductionOrders from "@/utils/api/priductions/getProductionsOrder";

import ProductionTabs from "./productionsTabs";


const Settings = async () => {
  const allproductions = await getProductions();
  const allproductionOrders = await getProductionOrders();

  return (
    <ProductionTabs
      allproductions={allproductions}
      allproductionOrders={allproductionOrders}
    />
  );
};
export default Settings;

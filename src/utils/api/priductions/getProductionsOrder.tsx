import { axiosApi } from "../api";

const getProductionOrders = async () => {
  try {
    const response = await axiosApi.get(`/production/orders`);

    return response.data;
  } catch (error: any) {
    let message = "";
    if (error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    throw message;
  }
};

export default getProductionOrders;

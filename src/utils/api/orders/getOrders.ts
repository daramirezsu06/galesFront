import { axiosApi } from "../api";

const GetOrders = async ({ userId }) => {
  try {
    const response = await axiosApi.get(`/orders`);
    console.log("response", response.data);
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

export default GetOrders;

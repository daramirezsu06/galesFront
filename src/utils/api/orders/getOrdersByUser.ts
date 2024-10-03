import { axiosApi } from "../api";

const GetOrdersByUSer = async ({ userId }) => {
  try {
    const response = await axiosApi.get(`/orders/filtered?userId=${userId}`);
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

export default GetOrdersByUSer;

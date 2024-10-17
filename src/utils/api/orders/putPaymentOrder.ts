import { axiosApi } from "../api";

const putPayentOrder = async (orderId) => {
  try {
    const response = await axiosApi.put(`/orders/updatePayment/${orderId}`);
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

export default putPayentOrder;

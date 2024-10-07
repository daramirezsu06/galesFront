import { axiosApi } from "../api";

const postNewProductionOrder = async (newProductionOrder) => {
  try {
    const response = await axiosApi.post(
      `/production/order`,
      newProductionOrder
    );

    return response.data;
  } catch (error: any) {
    console.log(error);

    let message = "";
    if (error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    throw message;
  }
};

export default postNewProductionOrder;

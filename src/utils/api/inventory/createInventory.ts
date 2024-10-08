import { axiosApi } from "../api";

const createInventoryTransaccion = async (newInventory) => {
  try {
    const response = await axiosApi.post(
      `/products/addInventory`,
      newInventory
    );
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

export default createInventoryTransaccion;

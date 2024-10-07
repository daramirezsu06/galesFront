import { axiosApi } from "../api";

const getProductions = async () => {
  try {
    const response = await axiosApi.get(`/production`);

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

export default getProductions;

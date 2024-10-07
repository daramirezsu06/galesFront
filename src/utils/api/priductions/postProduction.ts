import { axiosApi } from "../api";

const postNewProduction = async (newProduction) => {
  try {
    const response = await axiosApi.post(`production`, newProduction);

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

export default postNewProduction;

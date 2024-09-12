import { axiosApi } from "../api";

const postNewFormulation = async (newformulation) => {
  try {
    const response = await axiosApi.post(
      `/formulations/create`,
      newformulation
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

export default postNewFormulation;

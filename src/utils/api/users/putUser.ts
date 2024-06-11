import { axiosApi } from '../api';

const putUsers = async (id: string, changes) => {
  try {
    const response = await axiosApi.put(
      `/users/${id}`, changes
    );
    return response.data;
  } catch (error: any) {
    let message = '';
    if (error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    throw message;
  }
};

export default putUsers;

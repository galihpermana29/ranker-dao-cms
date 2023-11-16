import { message } from 'antd';
import axios from 'axios';

const createAPI = (
  baseURL = import.meta.env.MODE === 'development'
    ? '/dev/api/v1'
    : import.meta.env.VITE_BASE_URL + '/api/v1',
  config = {}
) => {
  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    ...config,
  });
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },

    (error) => {
      if (error.response.status === 400) {
        message.error('Error 400: Invalid Credentials');
      }

      if (error.response.status === 500) {
        message.error('Error 500: Internal Sever Error');
      }

      if (error.response.status === 401) {
        message.error('Error 401: Not Authorized');
      }

      return Promise.reject(error);
    }
  );
  // setup axios.intercept
  return axiosInstance;
};

const api = createAPI();

export default api;

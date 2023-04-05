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
      console.log(error);

      return Promise.reject(error);
    }
  );
  // setup axios.intercept
  return axiosInstance;
};

const api = createAPI();

export default api;

import axios from 'axios';

const createAPI = (
  baseURL = import.meta.env.MODE === 'development'
    ? '/dev/api/v1'
    : import.meta.env.VITE_BASE_URL + '/v1',
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
      if (
        error.response?.status === 500 &&
        error?.response?.data?.message === 'Token Not Valid'
      ) {
        console.log(error);
      }

      console.log(error);

      // if (error.response?.status === 401) {
      //   if (typeof window === 'undefined') {
      //     console.error('Unauthorized request');
      //   } else {
      //     window.location.href = '/login';
      //   }
      // }

      if (
        error?.response?.config?.method !== 'post' &&
        error?.response?.config?.method !== 'put' &&
        error?.response?.config?.method !== 'delete'
      ) {
        console.log(error, 'error');
      }

      return Promise.reject(error);
    }
  );
  // setup axios.intercept
  return axiosInstance;
};

const api = createAPI();

export default api;

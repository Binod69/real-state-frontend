import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 30000,
  timeoutErrorMessage: 'Server Timed Out',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'UNAUTHORIZED') {
      //TODO: LOGOUT
      throw error.response;
    } else if (error.code === 'FORBIDDEN') {
      throw error.response;
    } else if (error.code === 'INTERNAL_SERVER_ERROR') {
      console.error('internal_server_error', error);
    } else {
      throw error.response;
    }
  }
);

export default axiosInstance;

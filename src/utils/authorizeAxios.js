import axios from "axios";
import { toast } from "react-toastify";
import { API_ROOT } from "./constant";
import { interceptorLoadingElements } from "./formaters";
let authorizeAxios = axios.create({
  baseURL: API_ROOT,
});
authorizeAxios.defaults.timeout = 1000 * 60 * 10;
// cho phép axios tự động gửi cookie trong mỗi req lên BE
authorizeAxios.defaults.withCredentials = true;

authorizeAxios.interceptors.request.use(
  (config) => {
    interceptorLoadingElements(true);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authorizeAxios.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false);
    return response;
  },
  (error) => {
    interceptorLoadingElements(false);
    let errorMessage = error?.message;
    if (error?.response?.data?.message) {
      errorMessage = error?.response?.data?.message;
    }
    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

export default authorizeAxios;

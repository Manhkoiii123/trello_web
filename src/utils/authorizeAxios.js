/* eslint-disable no-unused-vars */
import axios from "axios";
import { toast } from "react-toastify";
import { API_ROOT } from "./constant";
import { interceptorLoadingElements } from "./formaters";
import { refreshTokenAPI } from "~/apis";
import { logoutUserApi } from "~/redux/user/userSlice";

// không thẻ dùng usedispatch vì đang ở file js thuần chứ ko phải jsx
// giải pháp là inject store : là kĩ thuật khi cần sử dụng redux trong các file ngoài phạm vi component như file này
// hiểu đơn giản nó là khi ứng dụng chạy lên thì code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta goij hàm injectStore để inject store vào
// ngay lập tức đẻ gán biến mainStore vào biến axiosReduxStore cục bộ trong file này
let axiosReduxStore;
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore;
};
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

let refreshTokenPromise = null;
authorizeAxios.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false);
    return response;
  },
  (error) => {
    interceptorLoadingElements(false);

    // xử lí refreshtoken tự đông
    // nếu nhân mã 401 => logout
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserApi(false)); // false vì ko muốn thông báo
    }
    // 410 => call refreshtoken
    // lấy các api đang bị lỗi thông qua error.config
    const originalRequests = error.config;
    if (error.response?.status === 410 && !originalRequests._retry) {
      // gán thêm retry luôn là true trong thời gian chời để đảm bảo viêc RT ày chỉ được call 1 lần tại 1 thời điểm
      // ko cần cũng được vì có cái refreshTokenPromise này rồi nhwung vẫn cho vào cũng được
      originalRequests._retry = true;
      // đảm bảo chỉ chạy 1 lần thôi
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((res) => {
            // đồng thời accesssToken đã được refresh rồi nên có thể gán lại vào header từ phía be rồi
            return res.accessToken;
          })
          .catch((_err) => {
            // nếu bất kì lỗi nào => logout luôn
            //axiosReduxStore.dispatch(logoutUserApi(false)); // false vì ko muốn thông báo
            return Promise.reject(_err);
          })
          .finally(() => {
            // luôn trả về null cho cái này
            refreshTokenPromise = null;
          });
      }
      return refreshTokenPromise.then((accesssToken) => {
        // b1 đối với các trường hơp dự án lưu accessToken vào ls hoặc đâu đó thì viết thêm ở đây
        // hiện tại be đanng xử lí rồi nên k cần nữa
        // call lại để chayj lại các api đang bị lối ban đầu
        return authorizeAxios(originalRequests);
      });
    }
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

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

let isRedirecting = false;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//에러감지
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log("애러 발생:", error.config?.url, error.response?.status);
    const data = error.response?.data;

    if (error.response?.status === 401 && !isRedirecting) {
      console.log("리다이렉트 실행");
      isRedirecting = true;

      localStorage.removeItem("accessToken");
      alert("세션이 만료되었습니다.");
      window.location.replace("/member/login");
    }

    return Promise.reject(error);
  },
);

export default api;

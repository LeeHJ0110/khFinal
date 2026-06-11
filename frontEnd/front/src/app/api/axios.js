import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

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
    const data = error.response?.data;

    if (data) {
      console.log(data);
    }

    if (data?.code === "M002") {
      alert("로그인 후 이용해 주세요");
      localStorage.removeItem("accessToken");
      window.location.replace("/member/login");
    }

    return Promise.reject(error);
  },
);

export default api;

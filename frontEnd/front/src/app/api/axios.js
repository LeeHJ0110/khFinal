import axios from "axios";

const api = axios.create({
  baseURL: `http://127.0.0.1/api`, //TODO IP 바꿔서 적용할것
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

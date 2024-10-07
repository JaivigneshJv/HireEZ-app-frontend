import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://hireez.azurewebsites.net/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;

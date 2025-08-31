import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export interface ApiResponse<T> {
  message: string;
  status: number;
  success: boolean;
  data: T;
}

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const api = instance;
export default api;

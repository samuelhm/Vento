import axios, { AxiosError } from "axios";
import { setAuthHint } from "./authHint";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: {
	"Content-Type": "application/json",
  },
  withCredentials: true,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if (status === 401 && typeof requestUrl === "string" && requestUrl.includes("/auth/me")) {
      setAuthHint(false);
    }

    return Promise.reject(error);
  }
);

export default httpClient;

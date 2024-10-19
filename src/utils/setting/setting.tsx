import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DOMAIN,
  timeout: 3000,
});

httpClient.interceptors.request.use(
  (req: InternalAxiosRequestConfig) => {
    if (req.headers) {
      const cybersoftToken = process.env.NEXT_PUBLIC_CYBERSOFT_TOKEN || "";
      if (cybersoftToken) {
        req.headers["tokenCybersoft"] = cybersoftToken;
      }
    }
    return req;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return error.response;
  }
);

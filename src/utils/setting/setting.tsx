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
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("Unauthorized: You need to log in first.");
          break;
        case 403:
          console.log(
            "Forbidden: You do not have permission to access this resource."
          );
          break;
        case 404:
          console.log("Not Found: The requested resource could not be found.");
          break;
        case 500:
          console.log(
            "Internal Server Error: There was a problem with the server."
          );
          break;
        default:
          console.log("Error An error occurred.");
          break;
      }
    } else if (error.request) {
      console.log(
        "No response received: The request was made but no response was received from the server."
      );
    } else {
      console.log("Error setting up request: ", error.message);
    }
    return Promise.reject(error.response);
  }
);

import axios from "axios";

// Create a reusable axios instance with the base URL pre-set.
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// REQUEST INTERCEPTOR - runs before every request is sent
api.interceptors.request.use(
  (config) => {
    console.log(`[REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
    config.headers["X-App-Name"] = "crud-assignment";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - runs after every response comes back
api.interceptors.response.use(
  (response) => {
    console.log(`[RESPONSE] ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("[API ERROR]", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;
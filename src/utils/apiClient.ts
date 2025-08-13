// apiClient.ts
import axios from "axios";

// Create a global event system to communicate with AuthProvider
let unauthorizedCallback: (() => void) | null = null;

export const setUnauthorizedCallback = (callback: (() => void) | null) => {
  unauthorizedCallback = callback;
};

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Automatically trigger AuthProvider dialog for 401 errors
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized Connection Error - triggering dialog');
      
      // Trigger the unauthorized dialog if callback is set
      if (unauthorizedCallback) {
        unauthorizedCallback();
      } else {
        // Fallback: dispatch a custom event that AuthProvider can listen to
        window.dispatchEvent(new CustomEvent('unauthorized-access'));
      }
    }
    
    // You can add other global error handling here if needed
    // For example, logging errors, showing generic error messages, etc.
    
    return Promise.reject(error);
  }
);

export const apiGet = (url: string, params?: any) =>
  apiClient.get(url, { params });

export const apiPost = (url: string, data?: any) =>
  apiClient.post(url, data);

export const apiPut = (url: string, data?: any) =>
  apiClient.put(url, data);

export const apiDelete = (url: string) =>
  apiClient.delete(url);

export const apiPatch = (url: string, data?: any) =>
  apiClient.patch(url, data);

// Helper function to check if an error is a 401
export const isUnauthorizedError = (error: any): boolean => {
  return error?.response?.status === 401;
};

// Helper function to get error message
export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

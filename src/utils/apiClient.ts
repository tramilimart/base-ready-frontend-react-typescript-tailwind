// apiClient.ts
import axios from "axios";
import type { ApiResponse } from "../interfaces/baseInterface";

// Create a global event system to communicate with AuthProvider
let unauthorizedCallback: (() => void) | null = null;

export const setUnauthorizedCallback = (callback: (() => void) | null) => {
  unauthorizedCallback = callback;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 10000,
  withCredentials: true,
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
    
    return Promise.reject(error);
  }
);

// Normalize any payload to ApiResponse shape
const toApiResponse = (payload: any): ApiResponse => {
  const inferredSuccess = typeof payload?.success === 'boolean' ? payload.success : true;
  const responseCode = payload?.responseCode as string | undefined;
  const message = payload?.message as string | undefined;

  const dataFn = () => {
    const raw = payload?.data !== undefined ? payload.data : payload;
    if (Array.isArray(raw)) return raw as any[];
    if (raw === undefined || raw === null) return [] as any[];
    return [raw] as any[];
  };

  return {
    success: inferredSuccess,
    responseCode,
    message,
    data: dataFn as any,
  };
};

// Normalize error to ApiResponse for rejection if desired (not used currently)
const toApiErrorResponse = (error: any): ApiResponse => {
  const payload = error?.response?.data ?? {};
  const message = payload?.message || error?.message || 'Request failed';
  const responseCode = payload?.responseCode;
  return {
    success: false,
    responseCode,
    message,
    data: (() => []) as any,
  };
};

export const apiGet = async (url: string, params?: any): Promise<ApiResponse> => {
  try {
    const data = await apiClient.get(url, { params });
    return toApiResponse(data);
  } catch (err: any) {
    throw toApiErrorResponse(err);
  }
};

export const apiPost = async (url: string, body?: any): Promise<ApiResponse> => {
  try {
    const data = await apiClient.post(url, body);
    return toApiResponse(data);
  } catch (err: any) {
    throw toApiErrorResponse(err);
  }
};

export const apiPut = async (url: string, body?: any): Promise<ApiResponse> => {
  try {
    const data = await apiClient.put(url, body);
    return toApiResponse(data);
  } catch (err: any) {
    throw toApiErrorResponse(err);
  }
};

export const apiDelete = async (url: string): Promise<ApiResponse> => {
  try {
    const data = await apiClient.delete(url);
    return toApiResponse(data);
  } catch (err: any) {
    throw toApiErrorResponse(err);
  }
};

export const apiPatch = async (url: string, body?: any): Promise<ApiResponse> => {
  try {
    const data = await apiClient.patch(url, body);
    return toApiResponse(data);
  } catch (err: any) {
    throw toApiErrorResponse(err);
  }
};

// Helper function to check if an error is a 401
export const isUnauthorizedError = (error: any): boolean => {
  return error?.response?.status === 401 || (error?.success === false && error?.responseCode === '401');
};

// Helper function to get error message
export const getErrorMessage = (error: any): string => {
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'An unexpected error occurred';
};

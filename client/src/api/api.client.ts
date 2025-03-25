import type { ApiResponse } from "./api.types";

/**
 * Creates an API client with basic HTTP methods
 * @param baseUrl - Base URL for all API requests. Defaults to VITE_API_URL environment variable
 * @returns Object containing HTTP methods (get, post, put, del)
 */
export const apiClientFactory = (
  baseUrl: string = import.meta.env.VITE_API_URL
) => {
  /**
   * Prepends the base URL to the given URL
   * @param url - URL to prepend base URL to
   * @returns Full URL with base URL prepended
   */
  const prependUrl = (url: string) => `${baseUrl}${url}`;

  /**
   * Makes a GET request to the specified URL
   * @param url - URL to make request to
   * @param options - Fetch options to include in request
   * @returns Promise resolving to response data of type T
   */
  const get = async <T>(url: string, options: RequestInit = {}) => {
    const res = await fetch(prependUrl(url), { ...options, method: "GET" });
    return (await res.json()) as ApiResponse<T>;
  };

  /**
   * Makes a POST request to the specified URL
   * @param url - URL to make request to
   * @param options - Fetch options to include in request
   * @returns Promise resolving to response data of type T
   */
  const post = async <T>(url: string, options: RequestInit = {}) => {
    const res = await fetch(prependUrl(url), { ...options, method: "POST" });
    return (await res.json()) as ApiResponse<T>;
  };

  /**
   * Makes a PUT request to the specified URL
   * @param url - URL to make request to
   * @param options - Fetch options to include in request
   * @returns Promise resolving to response data of type T
   */
  const put = async <T>(url: string, options: RequestInit = {}) => {
    const res = await fetch(prependUrl(url), { ...options, method: "PUT" });
    return (await res.json()) as ApiResponse<T>;
  };

  /**
   * Makes a DELETE request to the specified URL
   * @param url - URL to make request to
   * @param options - Fetch options to include in request
   * @returns Promise resolving to response data of type T
   */
  const del = async <T>(url: string, options: RequestInit = {}) => {
    const res = await fetch(prependUrl(url), { ...options, method: "DELETE" });
    return (await res.json()) as ApiResponse<T>;
  };

  return {
    get,
    post,
    put,
    del,
    baseUrl,
    prependUrl,
  };
};

export type ApiClient = ReturnType<typeof apiClientFactory>;

import { useStatic } from "@ubloimmo/uikit";
import { apiClientFactory } from "./api.client";
import { apiEndpointsFactory } from "./api.endpoints";
import { createContext, useContext } from "react";
import { API_QUERY_KEYS } from "./api.queries";

export const useApiContextStore = () => {
  const client = useStatic(apiClientFactory);

  const endpoints = useStatic(() => apiEndpointsFactory(client));
  const queryKeys = useStatic(API_QUERY_KEYS);

  return {
    client,
    endpoints,
    queryKeys,
  };
};

export type ApiContext = ReturnType<typeof useApiContextStore>;

export const API_CONTEXT = createContext<ApiContext>({
  client: apiClientFactory(),
  endpoints: apiEndpointsFactory(apiClientFactory()),
  queryKeys: API_QUERY_KEYS,
});

export const useApi = () => useContext(API_CONTEXT);

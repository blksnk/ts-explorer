import { useStatic } from "@ubloimmo/uikit";
import { apiClientFactory } from "./api.client";
import { apiEndpointsFactory } from "./api.endpoints";
import { createContext, useContext } from "react";
import { API_QUERY_KEYS } from "./api.queries";

export const useApiContext = () => {
  const client = useStatic(apiClientFactory);

  const endpoints = useStatic(() => apiEndpointsFactory(client));
  const queryKeys = useStatic(API_QUERY_KEYS);

  return {
    client,
    endpoints,
    queryKeys,
  };
};

export type ApiContext = ReturnType<typeof useApiContext>;

const apiContext = createContext<ApiContext>({
  client: apiClientFactory(),
  endpoints: apiEndpointsFactory(apiClientFactory()),
  queryKeys: API_QUERY_KEYS,
});

export const ApiContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const api = useApiContext();

  return <apiContext.Provider value={api}>{children}</apiContext.Provider>;
};

export const useApi = () => useContext(apiContext);

import { API_CONTEXT, useApiContextStore } from "./api.context";

/**
 * Provider component that makes the API context available to all child components
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to the API context
 * @returns {JSX.Element} Provider component wrapping children with API context
 */
export const ApiContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const api = useApiContextStore();

  return <API_CONTEXT.Provider value={api}>{children}</API_CONTEXT.Provider>;
};

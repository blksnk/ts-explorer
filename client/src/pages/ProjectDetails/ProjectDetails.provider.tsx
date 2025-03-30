import {
  PROJECT_DETAILS_CONTEXT,
  useProjectDetailsStore,
} from "./ProjectDetails.context";

/**
 * Provider component for the ProjectDetails context.
 * Wraps children with the ProjectDetails context provider to share project details state.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped with the context
 * @returns {JSX.Element} ProjectDetails context provider wrapping the children
 */
export const ProjectDetailsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const store = useProjectDetailsStore();

  return (
    <PROJECT_DETAILS_CONTEXT.Provider value={store}>
      {children}
    </PROJECT_DETAILS_CONTEXT.Provider>
  );
};

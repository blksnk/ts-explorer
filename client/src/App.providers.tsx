import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DialogProvider,
  ThemeProvider,
  UikitTranslationProvider,
} from "@ubloimmo/uikit";
import { ApiContextProvider } from "./api";

const queryClient = new QueryClient();

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiContextProvider>
        <ThemeProvider _forceTheme="lake" lightDarkSupport>
          <UikitTranslationProvider>
            <DialogProvider portalRoot="#dialog-root">
              {children}
            </DialogProvider>
          </UikitTranslationProvider>
        </ThemeProvider>
      </ApiContextProvider>
    </QueryClientProvider>
  );
};

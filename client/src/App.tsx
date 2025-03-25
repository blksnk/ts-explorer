import { AppProviders } from "./App.providers";
import { RouterProvider } from "react-router";
import { router } from "./router";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;

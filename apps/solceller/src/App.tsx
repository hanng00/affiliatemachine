import { useRoutes } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/index";
import BrfPage from "./pages/brf";
import VillaLandingPage from "./pages/villa";
import BrfLandingPage from "./pages/brf-guide";

/** Routes shared by the client (BrowserRouter) and prerender (StaticRouter) entries. */
export function AppRoutes() {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/brf", element: <BrfPage /> },
        { path: "/villa", element: <VillaLandingPage /> },
        { path: "/brf/guide", element: <BrfLandingPage /> },
      ],
    },
  ]);
}

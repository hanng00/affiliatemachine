import { useRoutes } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/index";
import GuidePage from "./pages/guide";

/** Routes shared by the client (BrowserRouter) and prerender (StaticRouter) entries. */
export function AppRoutes() {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/guide", element: <GuidePage /> },
      ],
    },
  ]);
}

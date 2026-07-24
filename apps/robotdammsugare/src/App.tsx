import { useRoutes } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/index";
import JamforPage from "./pages/jamfor";
import GuidePage from "./pages/guide";

/** Routes shared by the client (BrowserRouter) and prerender (StaticRouter) entries. */
export function AppRoutes() {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/jamfor", element: <JamforPage /> },
        { path: "/guide", element: <GuidePage /> },
      ],
    },
  ]);
}

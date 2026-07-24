import { useRoutes } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/index";
import JamforPage from "./pages/jamfor";
import ReglerPage from "./pages/regler";

/** Routes shared by the client (BrowserRouter) and prerender (StaticRouter) entries. */
export function AppRoutes() {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/jamfor", element: <JamforPage /> },
        { path: "/regler", element: <ReglerPage /> },
      ],
    },
  ]);
}

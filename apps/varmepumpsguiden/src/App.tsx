import { useRoutes } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/index";
import SystemPage from "./pages/system";
import SpinePage from "./pages/spine";

/** Routes shared by the client (BrowserRouter) and prerender (StaticRouter) entries. */
export function AppRoutes() {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        // System landing (Comparer on type intent): /bergvarme, /luft-vatten, /luft-luft
        { path: "/:system", element: <SystemPage /> },
        // Programmatic spine (Comparer + Ready at [type]+[location]): /bergvarme/linkoping
        { path: "/:system/:kommun", element: <SpinePage /> },
      ],
    },
  ]);
}

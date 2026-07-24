import { useRoutes } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/index";
import SearchPage from "./pages/search";
import JamforPage from "./pages/jamfor";
import Basta2026Page from "./pages/basta-2026";
import ForsakringsbolagPage from "./pages/forsakringsbolag";
import GuidePage from "./pages/guide";
import ForstagangsbilPage from "./pages/forstagangsbil";
import { OmOssPage, KontaktPage, IntegritetspolicyPage } from "./pages/static";

/** Routes shared by the client (BrowserRouter) and prerender (StaticRouter) entries. */
export function AppRoutes() {
  return useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/jamfor", element: <JamforPage /> },
        { path: "/basta-bilforsakring-2026", element: <Basta2026Page /> },
        { path: "/forsakringsbolag", element: <ForsakringsbolagPage /> },
        { path: "/forsakringsbolag/:slug", element: <ForsakringsbolagPage /> },
        { path: "/guide", element: <GuidePage /> },
        { path: "/forstagangsbil", element: <ForstagangsbilPage /> },
        { path: "/om-oss", element: <OmOssPage /> },
        { path: "/kontakt", element: <KontaktPage /> },
        { path: "/integritetspolicy", element: <IntegritetspolicyPage /> },
        { path: "/s/:id", element: <SearchPage /> },
      ],
    },
  ]);
}

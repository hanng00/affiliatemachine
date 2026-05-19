import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/index";
import JamforPage from "./pages/jamfor";
import GuidePage from "./pages/guide";
import HusdjurPage from "./pages/husdjur";
import LagenheterPage from "./pages/lagenheter";
import StoraHemPage from "./pages/stora-hem";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jamfor" element={<JamforPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/husdjur" element={<HusdjurPage />} />
          <Route path="/lagenheter" element={<LagenheterPage />} />
          <Route path="/stora-hem" element={<StoraHemPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

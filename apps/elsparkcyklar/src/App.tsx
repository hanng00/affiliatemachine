import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/index";
import JamforPage from "./pages/jamfor";
import ReglerPage from "./pages/regler";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jamfor" element={<JamforPage />} />
          <Route path="/regler" element={<ReglerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

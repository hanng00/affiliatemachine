import { Outlet } from "react-router-dom";
import { Header, Footer } from "@affiliate/ui";
import { siteConfig } from "../config/site";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={siteConfig.name} navigation={siteConfig.navigation} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer siteName={siteConfig.name} links={siteConfig.footerLinks} />
    </div>
  );
}

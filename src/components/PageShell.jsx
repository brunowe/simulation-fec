import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function PageShell({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ behavior: "auto", left: 0, top: 0 });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}

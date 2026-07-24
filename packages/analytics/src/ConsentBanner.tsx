import { useEffect, useState } from "react";
import { getStoredConsent, setConsent } from "./consent";

/**
 * GDPR consent banner (Swedish). Opt-in, with reject as prominent as accept.
 * Renders nothing once a choice is stored. Styles are inline so the banner
 * works in any app without depending on its Tailwind config.
 *
 * `policyHref` links to the site's privacy policy when one exists; omit it to
 * avoid rendering a broken link.
 */
export function ConsentBanner({ policyHref }: { policyHref?: string } = {}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getStoredConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (choice: "granted" | "denied") => {
    setConsent(choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Samtycke till cookies"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2147483647,
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
        padding: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5, color: "#374151", flex: "1 1 320px" }}>
          Vi använder cookies för att mäta trafik och förbättra sajten. Du kan
          acceptera eller neka analyscookies.
          {policyHref ? (
            <>
              {" "}
              Läs mer i vår{" "}
              <a href={policyHref} style={{ color: "#2563eb", textDecoration: "underline" }}>
                integritetspolicy
              </a>
              .
            </>
          ) : null}
        </p>
        <div style={{ display: "flex", gap: "8px", flex: "0 0 auto" }}>
          <button
            type="button"
            onClick={() => decide("denied")}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            Neka
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "1px solid #2563eb",
              background: "#2563eb",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Acceptera
          </button>
        </div>
      </div>
    </div>
  );
}

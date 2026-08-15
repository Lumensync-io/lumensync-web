import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/**
 * Site-wide Open Graph / Twitter card image (1200×630), generated at build
 * time from the approved headline. Text-only by design: no product capture is
 * embedded here so link previews never carry project data.
 */
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0a1220 0%, #0e1a2e 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "#39c7f4",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>
            {SITE_NAME}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {SITE_TAGLINE}
          </div>
          <div style={{ fontSize: 28, color: "#8fa1b8" }}>
            Lighting coordination intelligence for commercial projects
          </div>
        </div>
      </div>
    ),
    size,
  );
}

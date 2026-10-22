import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/nav/MobileTabBar";
import { Nav } from "@/components/nav/Nav";
import { TooltipDismiss } from "@/components/ui/Tooltip";
import { themeInitScript } from "@/lib/theme";
import { bodoni, jost, notoSansEthiopic, notoSerifEthiopic } from "./fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "Koba", template: "%s | Koba" },
  description: "Ethiopian fine dining in Gastown, Vancouver.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0e241b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const fontVars = [bodoni, jost, notoSerifEthiopic, notoSansEthiopic]
    .map((f) => f.variable)
    .join(" ");

  return (
    // Dark is the default for every first visit. The inline script swaps in a
    // saved light choice before first paint, so the attribute can differ from
    // the server render; suppressHydrationWarning accepts the DOM value.
    <html lang="en" data-theme="dark" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-0">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <TooltipDismiss />
        <Nav />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer />
        <MobileTabBar />
      </body>
    </html>
  );
}

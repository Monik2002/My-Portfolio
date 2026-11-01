import "../index.css";
import "../App.css";
import { Analytics } from "@vercel/analytics/next";
import PropTypes from "prop-types";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import SiteProviders from "../components/SiteProviders";
import WelcomeSplash from "../components/WelcomeSplash";
import { SITE_ORIGIN, SITE_URL } from "../lib/site-metadata";

export const metadata = {
  metadataBase: SITE_URL,
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Monik Chatterjee | Developer Portfolio",
    template: "%s | Monik Chatterjee",
  },
  description:
    "Portfolio of Monik Chatterjee, a developer who builds web applications and enjoys learning and sharing technology.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Monik Chatterjee",
    url: SITE_ORIGIN,
    title: "Monik Chatterjee | Developer Portfolio",
    description:
      "Portfolio of Monik Chatterjee, a developer who builds web applications and enjoys learning and sharing technology.",
  },
  twitter: {
    card: "summary",
    title: "Monik Chatterjee | Developer Portfolio",
    description:
      "Portfolio of Monik Chatterjee, a developer who builds web applications and enjoys learning and sharing technology.",
  },
  verification: {
    google: "H-AVlLdo7JhmBdj1rg36V2szxYXD2CCtgaaUAL4tsag",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteProviders>
          <WelcomeSplash />
          <Navigation />
          <div id="layout" className="layout">
            {children}
          </div>
          <Footer />
        </SiteProviders>
        <Analytics />
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

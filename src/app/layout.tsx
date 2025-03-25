import { Navbar } from "@/components/Navbar";
import SiteStatistic from "@/components/Statistic/SiteStatistic";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL(siteConfig?.url ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [siteConfig.publicLogoUrl],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-24 px-6 flex-grow">
              {children}
            </main>
            <SiteStatistic />
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://facebook.com/tuandeveloper02"
                title="Thiết kế bởi Tuấn Nguyễn"
              >
                <span className="text-default-600">
                  © {new Date().getFullYear().toString()} – Thiết kế bởi
                </span>
                <p className="text-primary">Tuấn Nguyễn</p>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

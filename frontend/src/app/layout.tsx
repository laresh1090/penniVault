import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.scss";
import "@/lib/fontawesome";
import BootstrapClient from "@/components/providers/BootstrapClient";
import AppProviders from "@/components/providers/AppProviders";
import MotionProvider from "@/app/providers/motion-provider";
import { ToastProvider } from "@/contexts/ToastContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "PenniVault \u2014 Asset Acquisition Infrastructure",
    template: "%s | PenniVault",
  },
  description:
    "PenniVault helps partner brands digitize and manage high-ticket asset acquisition through structured installment plans, savings, and marketplace integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <AppProviders>
          <MotionProvider>
            <ToastProvider>
              <BootstrapClient />
              {children}
            </ToastProvider>
          </MotionProvider>
        </AppProviders>
      </body>
    </html>
  );
}

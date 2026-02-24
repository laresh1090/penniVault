import type { Metadata } from "next";
import { Quicksand, Manrope, Caveat } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/template/flaticon.css";
import "./globals.scss";
import "@/lib/fontawesome";
import BootstrapClient from "@/components/providers/BootstrapClient";
import AppProviders from "@/components/providers/AppProviders";
import MotionProvider from "@/app/providers/motion-provider";
import { ToastProvider } from "@/contexts/ToastContext";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-quicksand",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-primary",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: {
    default: "PenniVault \u2014 Save & Invest",
    template: "%s | PenniVault",
  },
  description:
    "PenniVault helps you save smarter and invest better. Automated savings, fixed deposits, goal-based savings, group savings, and crowd investment opportunities in agriculture and real estate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${manrope.variable} ${caveat.variable}`}>
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

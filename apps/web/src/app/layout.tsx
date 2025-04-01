import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import "./globals.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Online Grocery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <Header />
        {children}
      </body>
    </html>
  );
}

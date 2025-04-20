import type { Metadata } from "next";
import { ToastContainer, Bounce } from "react-toastify";

import "./globals.css";
import Header from "@/components/header";
import { SessionProvider } from "next-auth/react";

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
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          closeButton={false}
          newestOnTop={false}
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

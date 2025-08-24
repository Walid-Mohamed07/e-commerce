import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import { WixClientContextProvider } from "@/context/wixContext";
// import StoreProvider from "@/components/shared/StoreProvider";
import QueryProvider from "@/components/shared/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lama Dev E-Commerce Application",
  description: "A complete e-commerce application with Next.js and Wix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <WixClientContextProvider> */}
        {/* <StoreProvider> */}
        <QueryProvider>
          <Navbar />
          {children}
          <Footer />
        </QueryProvider>
        {/* </StoreProvider> */}
        {/* </WixClientContextProvider> */}
      </body>
    </html>
  );
}

import localFont from "next/font/local";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";
import ScrollToTopButton from "@/components/scroll-top-button";
import "./globals.css";

const SariaStencilFont = localFont({
  src: [
    {
      path: "../public/fonts/SairaStencil-Italic-VariableFont_wdth,wght.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/SairaStencil-VariableFont_wdth,wght.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </head>
      <body
        className={`${SariaStencilFont.className} antialiased`}
      >
        <TRPCReactProvider>
          {children}
          <ScrollToTopButton/>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}

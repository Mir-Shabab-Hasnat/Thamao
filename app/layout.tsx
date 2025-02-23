import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import RootProviders from "../components/providers/provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Navbar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduScale",
  description: "Next Gen LMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="light"
        style={{
          colorScheme: "dark",
        }}
        suppressHydrationWarning
      >
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors position="bottom-right" />

            <RootProviders>
              
              {children}</RootProviders>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

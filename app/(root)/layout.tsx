import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import TopBar from "@/components/shared/TobBar";
import { ClerkProvider } from "@clerk/nextjs";
import BottomBar from "@/components/shared/BottomBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Anonymate",
  description: "A mental health support platform"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <TopBar />
          <section className="main-container">
            <div className="w-full max-w4xl">
              {children}
            </div>
          </section>
          <BottomBar />
        </body>

      </html>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import TopBar from "@/components/shared/TobBar";
import { ClerkProvider } from "@clerk/nextjs";
import BottomBar from "@/components/shared/BottomBar";
import LeftBar from "@/components/shared/LeftBar";

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
          <main className="flex flex-row">
            <LeftBar />
            <section className="main-container">

              <div className="w-full max-w4xl">
                {children}
              </div>
            </section>
          </main>

          <BottomBar />
        </body>

      </html>
    </ClerkProvider >
  );
}

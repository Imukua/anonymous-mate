import { Inter } from "next/font/google";
import "../globals.css";
import React from "react";

export const metadata = {
    title: "Anonymate",
    description: "A mental health support platform"
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children, }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`{$inter.className} bg-dark-1`}>

            </body>
        </html>
    );
}
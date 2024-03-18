import { Inter } from "next/font/google";
import "../globals.css";
import { describe } from "node:test";
import React from "react";

export const metadata = {
    title: "Anonymate",
    description: "A mental health support platform"
}


export default function RootLayout({ children, }: {
    children: React.ReactNode
}) {
    return (
        <></>
    );
}
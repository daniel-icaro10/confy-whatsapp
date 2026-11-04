"use client";

import { Suspense } from "react";
import { TopDoramaxCatalog } from "@/components/streaming/topdoramax-catalog";

export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-black" />}>
            <TopDoramaxCatalog />
        </Suspense>
    );
}

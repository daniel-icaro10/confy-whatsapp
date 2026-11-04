"use client";

import { Suspense } from "react";
import { TopDoramaxCatalog } from "@/components/streaming/topdoramax-catalog";

export default function CatalogoPage() {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-black" />}>
            <TopDoramaxCatalog forceCatalogView={true} />
        </Suspense>
    );
}

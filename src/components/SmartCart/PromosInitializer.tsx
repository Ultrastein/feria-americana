"use client";

import { useEffect } from "react";
import { useCartStore, PromoRule } from "@/store/useCartStore";

export default function PromosInitializer({ promos }: { promos: PromoRule[] }) {
    const setPromos = useCartStore((state) => state.setPromos);

    useEffect(() => {
        setPromos(promos);
    }, [promos, setPromos]);

    return null;
}

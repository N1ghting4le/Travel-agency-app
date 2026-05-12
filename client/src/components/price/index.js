"use client";

import { useDisplayPrice } from "@/hooks/displayPrice.hook";

export function Price({ price }) {
  const displayPrice = useDisplayPrice(price);

  return displayPrice;
}

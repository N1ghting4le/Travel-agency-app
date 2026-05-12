"use client";

import { useCurrency } from "../globalContext/hooks/useCurrency";

export function Price({ price }) {
  const { currency, conversionRate } = useCurrency();

  return `${(price * conversionRate).toFixed(2)} ${currency}`;
}

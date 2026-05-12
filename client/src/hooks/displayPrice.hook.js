import { useState, useEffect } from "react";

import { useCurrency } from "@/components/globalContext/hooks/useCurrency";

export const useDisplayPrice = (price) => {
  const { currency, conversionRate } = useCurrency();
  const [displayPrice, setDisplayPrice] = useState(() => price.toFixed(2));

  useEffect(() => {
    setDisplayPrice((price * conversionRate).toFixed(2));
  }, [price, conversionRate]);

  return `${displayPrice} ${currency}`;
};

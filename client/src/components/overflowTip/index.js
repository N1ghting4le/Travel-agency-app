import { useState, useRef, useEffect } from "react";
import { Tooltip } from "@mui/material";

export function OverflowTip({ children }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const textElementRef = useRef(null);

  const checkOverflow = () => {
    const element = textElementRef.current;

    if (element) {
      const parentElement = element.parentElement;
      const elWidth = element.getBoundingClientRect().width;
      const parentComputedStyle = getComputedStyle(parentElement);
      const parentPadding =
        parseFloat(parentComputedStyle.paddingLeft) +
        parseFloat(parentComputedStyle.paddingRight);
      const parentWidth =
        parentElement.getBoundingClientRect().width - parentPadding;

      setShowTooltip(elWidth > parentWidth);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <Tooltip
      title={children}
      disableHoverListener={!showTooltip}
      arrow
      slotProps={{
        popper: { anchorEl: textElementRef.current?.parentElement },
      }}
    >
      <span ref={textElementRef}>{children}</span>
    </Tooltip>
  );
}

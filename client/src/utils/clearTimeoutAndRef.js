export const clearTimeoutAndRef = (ref) => {
  if (ref.current) {
    clearTimeout(ref.current);
    ref.current = null;
  }
};

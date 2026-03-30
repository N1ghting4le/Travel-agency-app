export const classNames = (classNamesArray) =>
  classNamesArray
    .filter((className) => typeof className === "string" || className.apply)
    .map((className) =>
      typeof className === "string" ? className : className.name,
    )
    .join(" ");

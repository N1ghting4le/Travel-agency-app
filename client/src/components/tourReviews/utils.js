export const reviewStr = (length) => {
  if (!length) {
    return "Нет отзывов";
  }

  const remainder = length % 10;

  if ((length > 4 && length < 21) || !remainder || remainder > 4) {
    return `${length} отзывов`;
  }

  return `${length} отзыва`;
};

export const calculateAvgMark = (reviews) =>
  reviews.reduce((sum, curr) => sum + curr.mark, 0) / (reviews.length || 1);

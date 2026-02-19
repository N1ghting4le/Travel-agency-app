export const filterTours = (
  tours,
  priceRange,
  minRating,
  activeNutrTypes,
  activeRoomTypes,
) => {
  const [minPrice, maxPrice] = priceRange;

  return tours.filter((tour) => {
    const { basePrice, avgMark, hotel } = tour;
    const { nutritionTypes, roomTypes } = hotel;

    return (
      basePrice >= minPrice &&
      basePrice <= maxPrice &&
      avgMark >= minRating &&
      nutritionTypes.some((type) => activeNutrTypes.includes(type)) &&
      roomTypes.some((type) => activeRoomTypes.includes(type))
    );
  });
};

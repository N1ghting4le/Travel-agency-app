export const calculateTotalPrice = (
  availableRoomTypes,
  availableNutritionTypes,
  basePrice,
  { roomType, nutrType, adultsAmount, childrenAmount, startDate, endDate },
) => {
  const roomTypeWeight = availableRoomTypes.indexOf(roomType?.value) + 1;
  const nutrTypeWeight = availableNutritionTypes.indexOf(nutrType?.value) + 1;
  const dayDiff = endDate.diff(startDate, "day");

  return (
    basePrice *
    (dayDiff === 1 ? 1 : dayDiff * 0.9) *
    (roomTypeWeight === 1 ? 1 : roomTypeWeight * 0.75) *
    (nutrTypeWeight === 1 ? 1 : nutrTypeWeight * 0.8) *
    (adultsAmount === 1 ? 1 : adultsAmount * 0.85) *
    (childrenAmount > 1 ? childrenAmount * 0.7 : childrenAmount === 1 ? 1.4 : 1)
  );
};

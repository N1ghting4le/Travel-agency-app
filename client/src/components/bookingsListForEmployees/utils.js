export const groupBookings = (filteredBookings) =>
  Object.entries(
    Object.groupBy(filteredBookings, (b) => b.booking.bookingDate),
  );

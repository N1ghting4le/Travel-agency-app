import { EVERY } from "@/constants/bookingStatuses";

const containsSubtring = (string, substring) => {
  if (!substring) {
    return true;
  }

  return string.trim().toLowerCase().includes(substring.trim().toLowerCase());
};

export const filterBookings = (bookings, status, email, phoneNumber) =>
  bookings.filter(
    ({ booking, userInfo }) =>
      (status === EVERY || booking.status === status) &&
      containsSubtring(userInfo.email, email) &&
      containsSubtring(userInfo.phoneNumber, phoneNumber),
  );

export const groupBookings = (filteredBookings) =>
  Object.entries(
    Object.groupBy(filteredBookings, (b) => b.booking.bookingDate),
  );

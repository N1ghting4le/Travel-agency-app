import styles from "./page.module.css";
import { getData } from "@/utils/getData";
import { getTakenBookingsByEmployeeIdApiEndpoint } from "@/constants/queryPaths";
import TakenBookings from "@/components/takenBookings/TakenBookings";

export const metadata = {
  title: "Бронирования, с которыми вы работаете",
};

const TakenBookingsPage = async ({ params }) => {
  const bookings = await getData(
    getTakenBookingsByEmployeeIdApiEndpoint(params.emplId),
  );

  return (
    <main className={styles.main}>
      <h1>Бронирования, с которыми вы работаете</h1>
      <TakenBookings takenBookings={bookings} userId={params.emplId} />
    </main>
  );
};

export default TakenBookingsPage;

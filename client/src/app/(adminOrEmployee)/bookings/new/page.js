import styles from "./page.module.css";
import NewBookings from "@/components/newBookings/NewBookings";

export const metadata = {
  title: "Новые бронирования",
};

const BookingsPage = () => {
  return (
    <main className={styles.main}>
      <h1>Новые бронирования</h1>
      <NewBookings />
    </main>
  );
};

export default BookingsPage;

import styles from "./page.module.css";
import EmployeeBookingsView from "@/components/newBookings/EmployeeBookingsView";

export const metadata = {
  title: "Новые бронирования",
};

const BookingsPage = () => {
  return (
    <main className={styles.main}>
      <h1>Новые бронирования</h1>
      <EmployeeBookingsView areNewBookings />
    </main>
  );
};

export default BookingsPage;

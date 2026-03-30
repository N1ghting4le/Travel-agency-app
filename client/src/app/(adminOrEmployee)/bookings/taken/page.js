import styles from "./page.module.css";
import EmployeeBookingsView from "@/components/newBookings/EmployeeBookingsView";

export const metadata = {
  title: "Бронирования, с которыми вы работаете",
};

const TakenBookingsPage = () => {
  return (
    <main className={styles.main}>
      <h1>Бронирования, с которыми вы работаете</h1>
      <EmployeeBookingsView />
    </main>
  );
};

export default TakenBookingsPage;

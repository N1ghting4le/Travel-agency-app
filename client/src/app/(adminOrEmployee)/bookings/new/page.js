import styles from "./page.module.css";
import NewBookings from "@/components/newBookings/NewBookings";

const BookingsPage = () => {
    return (
        <main className={styles.main}>
            <h1>Новые бронирования</h1>
            <NewBookings/>
        </main>
    );
}

export default BookingsPage;
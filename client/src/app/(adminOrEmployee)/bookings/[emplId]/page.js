import styles from "./page.module.css";
import { getData } from "@/app/(adminOrEmployee)/admin/edit-tour/[id]/page";
import TakenBookings from "@/components/takenBookings/TakenBookings";

const TakenBookingsPage = async ({ params }) => {
    const bookings = await getData(`${process.env.BASE_URL}/booking/getTaken/${params.emplId}`);

    return (
        <main className={styles.main}>
            <h1>Бронирования, с которыми вы работаете</h1>
            <TakenBookings takenBookings={bookings} userId={params.emplId}/>
        </main>
    );
}

export default TakenBookingsPage;
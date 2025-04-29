import styles from "./page.module.css";
import UserInfo from "@/components/userInfo/UserInfo";
import BookingsList from "@/components/bookingsList/BookingsList";
import { getData } from "@/app/(adminOrEmployee)/admin/edit-tour/[id]/page";

export const metadata = {
    title: "Личный кабинет"
};

const UserPage = async ({ params }) => {
    const { id } = params;
    const bookings = await getData(`${process.env.BASE_URL}/booking/get/${id}`);

    return (
        <main className={styles.main}>
            <h1>Личный кабинет</h1>
            <UserInfo userId={id}/>
            <h2>{bookings.length ? "Забронированные туры" : "У вас пока нет забронированных туров"}</h2>
            <BookingsList bookings={bookings} userId={id}/>
        </main>
    );
}

export default UserPage;
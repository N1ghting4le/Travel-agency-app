import styles from "./page.module.css";
import UserInfo from "@/components/userInfo/UserInfo";
import BookingsList from "@/components/bookingsList/BookingsList";
import { getData } from "@/utils/getData";
import { getBookingsByClientIdApiEndpoint } from "@/constants/queryPaths";

export const metadata = {
  title: "Личный кабинет",
};

const UserPage = async ({ params }) => {
  const { id } = params;
  const bookings = await getData(getBookingsByClientIdApiEndpoint(id));

  return (
    <main className={styles.main}>
      <h1>Личный кабинет</h1>
      <UserInfo userId={id} />
      <h2>
        {bookings.length
          ? "Забронированные туры"
          : "У вас пока нет забронированных туров"}
      </h2>
      <BookingsList bookings={bookings} userId={id} />
    </main>
  );
};

export default UserPage;

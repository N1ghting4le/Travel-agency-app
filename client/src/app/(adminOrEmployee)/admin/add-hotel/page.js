import styles from "./page.module.css";
import HotelForm from "@/components/hotelForm/HotelForm";

export const metadata = {
    title: "Добавление отеля"
};

const AddHotelPage = () => (
    <main className={styles.main}>
        <h1>Добавление отеля</h1>
        <HotelForm/>
    </main>
);

export default AddHotelPage;
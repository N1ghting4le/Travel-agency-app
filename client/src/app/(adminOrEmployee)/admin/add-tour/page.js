import styles from "./page.module.css";
import TourForm from "@/components/tourForm/TourForm";

export const metadata = {
    title: "Добавление тура"
};

const AddTourPage = () => (
    <main className={styles.main}>
        <h1>Добавление тура</h1>
        <TourForm/>
    </main>
);

export default AddTourPage;
import styles from "./page.module.css";
import ResortForm from "@/components/resortForm/ResortForm";

export const metadata = {
    title: "Добавление курорта"
};

const AddResortPage = () => (
    <main className={styles.main}>
        <h1>Добавление курорта</h1>
        <ResortForm/>
    </main>
);

export default AddResortPage;
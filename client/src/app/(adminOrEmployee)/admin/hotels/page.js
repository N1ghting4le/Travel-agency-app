import styles from "./page.module.css";
import { AdminHotelsView } from "@/components/adminHotelsView";

export const metadata = {
  title: "Отели",
};

const HotelsPage = () => {
  return (
    <main className={styles.main}>
      <h1>Отели</h1>
      <AdminHotelsView />
    </main>
  );
};

export default HotelsPage;

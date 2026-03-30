import styles from "./page.module.css";
import { AdminToursView } from "@/components/adminToursView";

export const metadata = {
  title: "Туры",
};

const ToursPage = () => {
  return (
    <main className={styles.main}>
      <h1>Туры</h1>
      <AdminToursView />
    </main>
  );
};

export default ToursPage;

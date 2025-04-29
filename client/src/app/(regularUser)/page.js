import Image from "next/image";
import TourWrapper from "@/components/TourWrapper";
import styles from "./page.module.css";
import bg from "../../public/landing_bg.jpg";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={`${styles.bg} ${styles.bgGradient}`}>
        <div className={styles.sloganWrapper}>
          <p className={styles.slogan}>Загадайте своё путешествие, мы сделаем остальное</p>
          <p className={styles.subSlogan}>Ну очень крутая компания</p>
        </div>
      </div>
      <Image src={bg} alt="background" className={`${styles.bg} ${styles.bgImage}`} priority/>
      <TourWrapper/>
    </main>
  );
}
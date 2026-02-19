import styles from "./stars.module.css";
import { STARS } from "./constants";

const Stars = ({ stars, setStars }) => {
  const handleClick = (star) => () => {
    setStars(star);
  };

  return (
    <div className={styles.wrapper}>
      {STARS.map((star) => (
        <div
          key={star}
          className={`${styles.star} ${star <= stars ? styles.active : ""}`}
          onClick={handleClick(star)}
        />
      ))}
    </div>
  );
};

export default Stars;

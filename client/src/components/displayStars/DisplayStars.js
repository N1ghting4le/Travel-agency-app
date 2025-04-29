import styles from "./displayStars.module.css";
import Star from "../Star";

const DisplayStars = ({ stars }) => (
    <div className={styles.starsWrapper}>
        <div className={styles.stars}>{Array(stars).fill().map((_, i) => <Star key={i}/>)}</div>
        <p className={styles.text}>{stars}-звёздочный отель</p>
    </div>
);

export default DisplayStars;
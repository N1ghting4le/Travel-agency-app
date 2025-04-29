import styles from "./stars.module.css";

const Stars = ({ stars, setStars }) => {
    const handleClick = (i) => setStars(i + 1);

    const renderStars = () => Array(5).fill().map((_, i) => (
        <div key={i}
            className={`${styles.star} ${i < stars ? styles.active : ''}`}
            onClick={() => handleClick(i)}/>
    ));

    const starsEls = renderStars();

    return (
        <div className={styles.wrapper}>
            {starsEls}
        </div>
    );
}

export default Stars;
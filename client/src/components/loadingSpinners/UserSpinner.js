import styles from "./userSpinner.module.css";

const UserSpinner = () => (
    <svg className={styles.loader} viewBox="0 0 50 50">
        <path className={styles.corners} d="m 0 12.5 l 0 -12.5 l 50 0 l 0 50 l -50 0 l 0 -37.5"/>
    </svg>
);

export default UserSpinner;
import styles from "./submitBtn.module.css";

const SubmitBtn = ({ children, ...props }) => (
    <button type="submit" className={styles.btn} {...props}>{children}</button>
);

export default SubmitBtn;
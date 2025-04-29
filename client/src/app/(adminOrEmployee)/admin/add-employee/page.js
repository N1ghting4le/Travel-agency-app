import styles from "../../../sign-up/page.module.css";
import SignUpForm from "@/components/signUpForm/SignUpForm";
import Image from "next/image";
import picture from "@/public/signup_image.jpg";

export const metadata = {
    title: "Добавление сотрудника"
};

const AddEmployee = () => {
    return (
        <main className={styles.main}>
            <Image src={picture} alt="sign up picture" className={styles.picture} priority/>
            <div className={styles.container}>
                <h1>Добавление сотрудника</h1>
                <SignUpForm/>
            </div>
        </main>
    );
}

export default AddEmployee;
import styles from "./page.module.css";
import SignUpForm from "@/components/signUpForm/SignUpForm";
import Logo from "@/components/logo/Logo";
import Image from "next/image";
import Link from "next/link";
import picture from "@/public/signup_image.jpg";

export const metadata = {
    title: "Регистрация"
};

const SignUpPage = () => {
    return (
        <main className={styles.main}>
            <Image src={picture} alt="sign up picture" className={styles.picture} priority/>
            <div className={styles.container}>
                <Link href="/"><Logo/></Link>
                <h1>Регистрация</h1>
                <SignUpForm/>
                <p style={{alignSelf: "center"}}>
                    Уже зарегистрированы?
                    <Link href="/sign-in" style={{color: "salmon"}} replace> Вход</Link>
                </p>
            </div>
        </main>
    );
}

export default SignUpPage;
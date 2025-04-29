import styles from "./page.module.css";
import SignInForm from "@/components/signInForm/SignInForm";
import Logo from "@/components/logo/Logo";
import Image from "next/image";
import Link from "next/link";
import picture from "../../public/signup_image.jpg";

export const metadata = {
    title: "Вход"
};

const SignInPage = () => {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/"><Logo/></Link>
                <h1>Вход</h1>
                <SignInForm/>
                <p style={{alignSelf: "center"}}>
                    Нет аккаунта?
                    <Link href="/sign-up" style={{color: "salmon"}} replace> Регистрация</Link>
                </p>
            </div>
            <Image src={picture} alt="sign up picture" className={styles.picture} priority/>
        </main>
    );
}

export default SignInPage;
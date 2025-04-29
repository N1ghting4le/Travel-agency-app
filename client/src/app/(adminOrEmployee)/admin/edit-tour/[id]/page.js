import styles from "./page.module.css";
import TourForm from "@/components/tourForm/TourForm";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Редактирование тура"
};

export const getData = async (url) => {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) return redirect('/');

    return await res.json();
}

const EditTourPage = async ({ params }) => {
    const { hotel, ...tour } = await getData(`${process.env.BASE_URL}/tour/get/${params.id}`);
    const tourObj = { ...tour, hotelTitle: hotel.hotelTitle };

    return (
        <main className={styles.main}>
            <h1>Редактирование тура</h1>
            <TourForm tour={tourObj}/>
        </main>
    );
}

export default EditTourPage;
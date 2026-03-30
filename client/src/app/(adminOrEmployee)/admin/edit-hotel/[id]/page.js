import styles from "./page.module.css";
import HotelForm from "@/components/hotelForm/HotelForm";
import { getHotelByIdApiEndpoint } from "@/constants/queryPaths";
import { getData } from "@/utils/getData";

export const metadata = {
  title: "Редактирование отеля",
};

const EditHotelPage = async ({ params }) => {
  const hotel = await getData(getHotelByIdApiEndpoint(params.id));

  return (
    <main className={styles.main}>
      <h1>Редактирование отеля</h1>
      <HotelForm hotel={hotel} />
    </main>
  );
};

export default EditHotelPage;

import styles from "./page.module.css";
import TourForm from "@/components/tourForm/TourForm";
import { getTourByIdApiEndpoint } from "@/constants/queryPaths";
import { getData } from "@/utils/getData";

export const metadata = {
  title: "Редактирование тура",
};

const EditTourPage = async ({ params }) => {
  const {
    hotel: { id, hotelTitle },
    ...tour
  } = await getData(getTourByIdApiEndpoint(params.id));
  const tourObj = { ...tour, hotel: { id, hotelTitle } };

  return (
    <main className={styles.main}>
      <h1>Редактирование тура</h1>
      <TourForm tour={tourObj} />
    </main>
  );
};

export default EditTourPage;

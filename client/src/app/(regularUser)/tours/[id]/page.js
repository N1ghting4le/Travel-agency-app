import styles from "./page.module.css";
import { BASE_URL } from "@/env";
import DisplayStars from "@/components/displayStars/DisplayStars";
import { Divider } from "@mui/material";
import TourReviews from "@/components/tourReviews/TourReviews";
import AllTourPhotos from "@/components/allTourPhotos/AllTourPhotos";
import BookTourModal from "@/components/bookTourModal/BookTourModal";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LanguageIcon from "@mui/icons-material/Language";
import SurfingIcon from "@mui/icons-material/Surfing";
import PinDropIcon from "@mui/icons-material/PinDrop";
import { getData } from "@/app/(adminOrEmployee)/admin/edit-tour/[id]/page";

const TourPage = async ({ params }) => {
  const tour = await getData(`${process.env.BASE_URL}/tour/get/${params.id}`);
  const {
    departureCity,
    destinationCountry,
    tourTitle,
    id,
    tourDescr,
    tourNotes,
    hotel,
    basePrice,
  } = tour;
  const {
    hotelTitle,
    resort,
    address,
    hotelDescr,
    stars,
    hotelNotes,
    nutritionTypes,
    roomTypes,
    photos,
  } = hotel;
  const { resortTitle } = resort;

  const tourInfoArr = [
    [LocationCityIcon, "Город вылета:", departureCity],
    [LanguageIcon, "Страна прибытия:", destinationCountry],
    [SurfingIcon, "Курорт:", resortTitle],
  ];

  return (
    <main className={styles.main}>
      <h1>{tourTitle}</h1>
      <div className={styles.tourInfo}>
        {tourInfoArr.map(([Icon, title, info]) => (
          <div key={title} className={styles.tourInfoItem}>
            <div className={styles.tourInfoItemTitle}>
              <Icon style={{ color: "salmon" }} />
              <p className={styles.bold}>{title}</p>
            </div>
            <p>{info}</p>
          </div>
        ))}
        <p className={styles.priceWrapper}>
          от <span className={styles.price}>${basePrice}</span>/ночь
        </p>
      </div>
      <p>{tourDescr}</p>
      {tourNotes && (
        <div className={styles.notes}>
          <p className={styles.bold}>Примечания:</p>
          <p className={styles.tourDescr}>{tourNotes}</p>
        </div>
      )}
      <div className={styles.hotelInfo}>
        <h2>Отель:</h2>
        <div className={styles.hotelInfoTop}>
          <div className={styles.mainHotelInfo}>
            <h3>{hotelTitle}</h3>
            <DisplayStars stars={stars} />
            <div className={styles.addressWrapper}>
              <PinDropIcon />
              <p>{address}</p>
            </div>
          </div>
          <BookTourModal
            id={id}
            roomTypes={roomTypes}
            nutrTypes={nutritionTypes}
            basePrice={basePrice}
          />
        </div>
        <div className={styles.photos}>
          {photos.slice(0, 5).map((src, i) => (
            <img
              key={src}
              src={`${BASE_URL}/uploads/${destinationCountry}/${resortTitle}/${hotelTitle}/${src}`}
              alt={`hotel photo ${i + 1}`}
              className={styles.photo}
            />
          ))}
          <AllTourPhotos
            baseSrc={`${BASE_URL}/uploads/${destinationCountry}/${resortTitle}/${hotelTitle}`}
            photos={photos}
            title={hotelTitle}
          />
        </div>
      </div>
      <Divider />
      <p>{hotelDescr}</p>
      {hotelNotes && (
        <div className={styles.notes}>
          <p className={styles.bold}>Примечания:</p>
          <p className={styles.tourDescr}>{hotelNotes}</p>
        </div>
      )}
      <TourReviews id={id} />
    </main>
  );
};

export default TourPage;

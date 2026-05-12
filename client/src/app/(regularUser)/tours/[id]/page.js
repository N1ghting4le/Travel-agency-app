import styles from "./page.module.css";
import { getTourByIdApiEndpoint } from "@/constants/queryPaths";
import DisplayStars from "@/components/displayStars/DisplayStars";
import { Divider } from "@mui/material";
import TourReviews from "@/components/tourReviews/TourReviews";
import AllTourPhotos from "@/components/allTourPhotos/AllTourPhotos";
import BookTourModal from "@/components/bookTourModal/BookTourModal";
import Map from "@/components/map/Map";
import PinDropIcon from "@mui/icons-material/PinDrop";
import { getData } from "@/utils/getData";
import { getTourInfo, getPhotoSrc } from "./utils";

const TourPage = async ({ params }) => {
  const tour = await getData(getTourByIdApiEndpoint(params.id));
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
    resort: { resortTitle },
    address,
    hotelDescr,
    stars,
    hotelNotes,
    nutritionTypes,
    roomTypes,
    photos,
  } = hotel;

  const tourInfo = getTourInfo(departureCity, destinationCountry, resortTitle);

  return (
    <main className={styles.main}>
      <h1>{tourTitle}</h1>
      <div className={styles.tourInfo}>
        {tourInfo.map(({ Icon, label, info }) => (
          <div key={label} className={styles.tourInfoItem}>
            <div className={styles.tourInfoItemTitle}>
              <Icon style={{ color: "salmon" }} />
              <p className={styles.bold}>{label}</p>
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
          {photos.slice(0, 5).map((name) => (
            <img
              key={name}
              src={getPhotoSrc(
                destinationCountry,
                resortTitle,
                hotelTitle,
                name,
              )}
              alt={name}
              className={styles.photo}
            />
          ))}
          <AllTourPhotos
            baseSrc={getPhotoSrc(destinationCountry, resortTitle, hotelTitle)}
            photos={photos}
            title={hotelTitle}
          />
        </div>
        <Map {...{ address }} />
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

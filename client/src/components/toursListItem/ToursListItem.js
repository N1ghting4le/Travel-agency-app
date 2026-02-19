"use client";

import { deleteTourApiEndpoint } from "@/constants/queryPaths";
import styles from "./toursListItem.module.css";
import { useAdmin } from "../globalContext/hooks/useAdmin";
import { useTours } from "../globalContext/hooks/useTours";
import useQuery from "@/hooks/query.hook";
import Link from "next/link";
import DisplayStars from "../displayStars/DisplayStars";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminSpinner from "../loadingSpinners/AdminSpinner";
import { reviewStr } from "../tourReviews/utils";
import { getPhotoSrc } from "@/app/(regularUser)/tours/[id]/utils";

const ToursListItem = ({ tour }) => {
  const {
    id,
    tourTitle,
    destinationCountry: country,
    hotel,
    avgMark,
    amount: marksAmount,
    basePrice: price,
  } = tour;
  const { hotelTitle, resort, photo, stars } = hotel;
  const { isAdmin } = useAdmin();
  const { deleteTour } = useTours();
  const { query, isIdle, isLoading, isError, isSuccess, resetQueryState } =
    useQuery();

  const removeTour = async () => {
    try {
      await query(deleteTourApiEndpoint(id), { method: "DELETE" });
      setTimeout(() => deleteTour(id), 2000);
    } finally {
      setTimeout(resetQueryState, 2000);
    }
  };

  return (
    <>
      <li className={styles.listItem}>
        <img
          src={getPhotoSrc(country, resort, hotelTitle, photo)}
          alt={`${hotelTitle} photo`}
          className={styles.photo}
        />
        <div className={styles.info}>
          <div className={styles.topInfo}>
            <p className={styles.title}>{tourTitle}</p>
            <p>
              от <span className={styles.price}>${price}</span>/ночь
            </p>
          </div>
          <p>
            {country}, {resort}
          </p>
          <p>{hotelTitle}</p>
          <DisplayStars stars={stars} />
          <div className={styles.marks}>
            <p className={styles.mark}>{avgMark.toFixed(1)}</p>
            <p>{reviewStr(marksAmount)}</p>
          </div>
          <div className={styles.btnWrapper}>
            <Link href={`/tours/${id}`} className={styles.link}>
              <button className={styles.btn} disabled={isLoading || isSuccess}>
                Посмотреть тур
              </button>
            </Link>
            {isAdmin && (isIdle || isError) && (
              <>
                <Link href={`/admin/edit-tour/${id}`}>
                  <EditIcon />
                </Link>
                <DeleteIcon
                  style={{ cursor: "pointer" }}
                  onClick={removeTour}
                />
              </>
            )}
          </div>
        </div>
      </li>
      {isLoading && <AdminSpinner />}
      {isError && <p style={{ color: "red" }}>Произошла ошибка</p>}
      {isSuccess && <p style={{ color: "green" }}>Тур удалён</p>}
    </>
  );
};

export default ToursListItem;

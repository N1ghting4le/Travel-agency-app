"use client";

import { getReviewsByTourIdApiEndpoint } from "@/constants/queryPaths";
import styles from "./tourReviews.module.css";
import useQuery from "@/hooks/query.hook";
import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "../globalContext/hooks/useAdmin";
import { useUser } from "../globalContext/hooks/useUser";
import { useTours } from "../globalContext/hooks/useTours";
import { useRouter } from "next/navigation";
import TourLoading from "../loadingSpinners/TourLoading";
import ReviewModal from "../reviewModal/ReviewModal";
import EditIcon from "@mui/icons-material/Edit";
import { reviewStr, calculateAvgMark } from "./utils";

const TourReviews = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(null);
  const { query, isLoading, isError } = useQuery();
  const { isAdmin } = useAdmin();
  const { user } = useUser();
  const { changeAvgMark } = useTours();
  const router = useRouter();

  const avgMark = useMemo(
    () => Number(calculateAvgMark(reviews).toFixed(1)),
    [reviews],
  );

  const getReviews = async () => {
    const res = await query(getReviewsByTourIdApiEndpoint(id));
    setReviews(res);
  };

  useEffect(() => {
    getReviews();
  }, []);

  useEffect(
    () => changeAvgMark(id, avgMark, reviews.length),
    [id, avgMark, reviews.length, changeAvgMark],
  );

  const openModal = () => {
    if (user) {
      setOpen(true);
      document.scrollingElement.style.overflow = "hidden";
    } else {
      router.push("/sign-in");
    }
  };

  const openModalForEdit = (i) => () => {
    setReviewIndex(i);
    openModal();
  };

  if (isLoading) {
    return <TourLoading />;
  }

  if (isError) {
    return (
      <div>
        <p style={{ color: "red" }}>Произошла ошибка</p>
        <button className={styles.btn} onClick={getReviews}>
          Попробовать снова
        </button>
      </div>
    );
  }

  const str = reviewStr(reviews.length);

  return (
    <div>
      <div className={styles.reviewsTop}>
        <div className={styles.reviewsInfo}>
          <h2>Отзывы:</h2>
          <div className={styles.avgRatingWrapper}>
            <p className={styles.avgRating}>{avgMark}</p>
            <p className={styles.amount}>{str}</p>
          </div>
        </div>
        {!isAdmin && (
          <button className={styles.btn} onClick={openModal}>
            Оставить отзыв
          </button>
        )}
        <ReviewModal
          open={open}
          setOpen={setOpen}
          setReviews={setReviews}
          review={reviews[reviewIndex]}
          setReviewIndex={setReviewIndex}
          tourId={id}
        />
      </div>
      <ul className={styles.reviewsList}>
        {reviews.map(
          ({ id, userId, name, surname, mark, reviewText, reviewDate }, i) => {
            const dateStr = new Date(reviewDate).toLocaleDateString("ru-RU");

            return (
              <li key={id} className={styles.review}>
                <div className={styles.reviewMain}>
                  <p style={{ fontWeight: 600 }}>{mark}</p>
                  <div className={styles.vertical} />
                  <p>
                    {name} {surname}
                  </p>
                  <div className={styles.vertical} />
                  <p>{dateStr}</p>
                  <EditIcon
                    style={{
                      display: user?.id === userId ? "block" : "none",
                      cursor: "pointer",
                    }}
                    onClick={openModalForEdit(i)}
                    fontSize="small"
                  />
                </div>
                <p style={{ marginTop: "10px" }}>{reviewText}</p>
              </li>
            );
          },
        )}
      </ul>
    </div>
  );
};

export default TourReviews;

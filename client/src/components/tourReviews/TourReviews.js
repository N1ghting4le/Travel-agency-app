"use client";

import {
  getReviewsByTourIdApiEndpoint,
  getAvgMarkByTourIdApiEndpoint,
} from "@/constants/queryPaths";
import styles from "./tourReviews.module.css";
import useQuery from "@/hooks/query.hook";
import { usePagination } from "@/hooks/pagination.hook";
import { useState, useEffect } from "react";
import { useAdmin } from "../globalContext/hooks/useAdmin";
import { useUser } from "../globalContext/hooks/useUser";
import { useRouter } from "next/navigation";
import TourLoading from "../loadingSpinners/TourLoading";
import ReviewModal from "../reviewModal/ReviewModal";
import EditIcon from "@mui/icons-material/Edit";
import { Pagination } from "../pagination";
import { reviewStr } from "./utils";

const TourReviews = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [avgMark, setAvgMark] = useState(0);
  const [reviewsAmount, setReviewsAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(null);
  const {
    page,
    setPage,
    pagination,
    initialQuery,
    isInitialQueryExecuted,
    paginatedQuery,
    queryState: { isLoading, isError },
  } = usePagination();
  const { query } = useQuery();
  const { isAdmin } = useAdmin();
  const { user } = useUser();
  const router = useRouter();

  const getReviews = async () => {
    if (isInitialQueryExecuted) {
      const res = await paginatedQuery();
      setReviews(res);
    }
  };

  const getAvgMarkAndReviewsAmount = async () => {
    const { avgMark, reviewsAmount } = await query(
      getAvgMarkByTourIdApiEndpoint(id),
      {
        authorize: false,
      },
    );
    setAvgMark(Number(avgMark.toFixed(1)));
    setReviewsAmount(reviewsAmount);
  };

  const invalidateReviews = () => {
    getReviews();
    getAvgMarkAndReviewsAmount();
  };

  useEffect(() => {
    initialQuery(getReviewsByTourIdApiEndpoint(id), { authorize: false }).then(
      setReviews,
    );
    getAvgMarkAndReviewsAmount();
  }, []);

  useEffect(() => {
    getReviews();
  }, [page]);

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

  const str = reviewStr(reviewsAmount);

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
          invalidateReviews={invalidateReviews}
          review={reviews[reviewIndex]}
          setReviewIndex={setReviewIndex}
          tourId={id}
        />
      </div>
      <div className={styles.reviewsListAndPagination}>
        <ul className={styles.reviewsList}>
          {reviews.map(
            (
              { id, userId, name, surname, mark, reviewText, reviewDate },
              i,
            ) => {
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
        <Pagination {...{ page, setPage, pagination }} />
      </div>
    </div>
  );
};

export default TourReviews;

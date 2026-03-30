"use client";

import styles from "./reviewForm.module.css";
import {
  CREATE_REVIEW_API_ENDPOINT,
  UPDATE_REVIEW_API_ENDPOINT,
} from "@/constants/queryPaths";
import { useState } from "react";
import useQuery from "@/hooks/query.hook";
import Stars from "../stars/Stars";
import Input from "../input/Input";
import UserSpinner from "../loadingSpinners/UserSpinner";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";

const ReviewForm = ({
  invalidateReviews,
  review,
  tourId,
  setCanClose,
  handleClose,
}) => {
  const [mark, setMark] = useState(review?.mark ?? 1);
  const [text, setText] = useState(review?.reviewText ?? "");
  const [errorMsg, setErrorMsg] = useState(null);
  const [isFirstSubmit, setIsFirstSubmit] = useState(true);
  const { query, queryState, resetQueryState } = useQuery();

  const onChange = (e) => {
    setText(e.target.value);
  };

  const trimmedText = text.trim();

  const createReview = async (body) => {
    await query(CREATE_REVIEW_API_ENDPOINT, {
      method: "POST",
      json: true,
      body: JSON.stringify(body),
    });

    invalidateReviews();
  };

  const updateReview = async (body) => {
    await query(UPDATE_REVIEW_API_ENDPOINT, {
      method: "PATCH",
      json: true,
      body: JSON.stringify(body),
    });

    invalidateReviews();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsFirstSubmit(false);

    if (!trimmedText) {
      return;
    }

    setCanClose(false);

    const body = {
      id: review?.id || null,
      tourId,
      mark,
      reviewText: trimmedText,
    };

    try {
      if (review) {
        await updateReview(body);
      } else {
        await createReview(body);
      }

      setTimeout(handleClose, 2000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setCanClose(true);
      setTimeout(() => {
        resetQueryState();
        setErrorMsg(null);
      }, 2000);
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.fieldWrapper}>
        <p>Ваша оценка</p>
        <Stars stars={mark} setStars={setMark} />
      </div>
      <Input
        placeholder="Текст отзыва"
        multiline
        value={text}
        onChange={onChange}
        error={
          trimmedText || isFirstSubmit
            ? null
            : { message: "Текст отзыва обязателен" }
        }
      />
      <SubmitWrapper
        queryState={queryState}
        spinner={<UserSpinner />}
        btnText={review ? "Сохранить изменения" : "Отправить"}
        errorMsg={errorMsg}
        successText={review ? "Отзыв изменён" : "Отзыв отправлен"}
        disabled={review && review.text === trimmedText && review.mark === mark}
      />
    </form>
  );
};

export default ReviewForm;

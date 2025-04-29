'use client';

import styles from "./reviewForm.module.css";
import { BASE_URL } from "@/env";
import { useState } from "react";
import { useToken } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";
import Stars from "../stars/Stars";
import Input from "../input/Input";
import UserSpinner from "../loadingSpinners/UserSpinner";
import SubmitWrapper from "../submitWrapper/SubmitWrapper";

const ReviewForm = ({ setReviews, review, tourId, setCanClose, handleClose }) => {
    const [currReview, setCurrReview] = useState({
        text: review?.reviewText || "",
        mark: review?.mark || 1
    });
    const [mark, setMark] = useState(currReview.mark);
    const [text, setText] = useState(currReview.text);
    const [initial, setInitial] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const { token } = useToken();
    const { query, queryState, resetQueryState } = useQuery();

    const onChange = (e) => setText(e.target.value);

    const onSubmit = (e) => {
        e.preventDefault();
        setInitial(false);

        const trimmedText = text.trim();
        if (!trimmedText) return;
        setCanClose(false);

        const body = {
            id: review?.id || null,
            tourId,
            mark,
            reviewText: trimmedText
        };
        
        query(`${BASE_URL}/review/${review ? "update" : "create"}`, review ? "PATCH" : "POST", {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }, JSON.stringify(body))
            .then((res) => {
                if (review) {
                    setReviews(reviews => reviews.map(item => res.id === item.id ? res : item));
                    setCurrReview({ text: res.reviewText, mark: res.mark });
                } else {
                    setReviews(reviews => [res, ...reviews]);
                }

                setTimeout(handleClose, 2000);
            })
            .catch(err => setErrorMsg(err.message))
            .finally(() => {
                setCanClose(true);
                setTimeout(() => {
                    resetQueryState();
                    setErrorMsg('');
                }, 2000);
            });
    }

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.fieldWrapper}>
                <p>Ваша оценка</p>
                <Stars stars={mark} setStars={setMark}/>
            </div>
            <Input
                placeholder="Текст отзыва"
                multiline
                value={text}
                onChange={onChange}
                error={initial || text.trim() ? null : { message: "Текст отзыва обязателен" }}/>
            <SubmitWrapper
                queryState={queryState}
                spinner={<UserSpinner/>}
                btnText={review ? "Сохранить изменения" : "Отправить"}
                errorMsg={errorMsg}
                successText={review ? "Отзыв изменён" : "Отзыв отправлен"}
                disabled={review && currReview.text === text.trim() && currReview.mark === mark}/>
        </form>
    );
}

export default ReviewForm;
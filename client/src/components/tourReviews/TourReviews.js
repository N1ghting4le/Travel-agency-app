'use client';

import { BASE_URL } from "@/env";
import styles from "./tourReviews.module.css";
import useQuery from "@/hooks/query.hook";
import { useState, useEffect, useMemo } from "react";
import { useAdmin, useUser, useTours } from "../GlobalContext";
import { useRouter } from "next/navigation";
import TourLoading from "../loadingSpinners/TourLoading";
import ReviewModal from "../reviewModal/ReviewModal";
import EditIcon from '@mui/icons-material/Edit';

export const reviewStr = (length) => {
    if (!length) return "Нет отзывов";

    let strEnd = "отзыв", remainder = length % 10;

    if ((length > 4 && length < 21) || !remainder || remainder > 4){
        strEnd += "ов";
    } else if (remainder > 1 && remainder < 5) {
        strEnd += "а";
    }
    
    return length + " " + strEnd;
}

const TourReviews = ({ id }) => {
    const [reviews, setReviews] = useState([]);
    const [open, setOpen] = useState(false);
    const [review, setReview] = useState(null);
    const { query, queryState } = useQuery();
    const { isAdmin } = useAdmin();
    const { user } = useUser();
    const { changeAvgMark } = useTours();
    const router = useRouter();

    const avgMark = useMemo(() =>
        +(reviews.reduce((sum, curr) => sum + curr.mark, 0) / (reviews.length || 1)).toFixed(1),
    [reviews]);

    const getReviews = () => {
        query(`${BASE_URL}/review/get/${id}`).then(res => setReviews(res));
    }

    useEffect(getReviews, []);
    useEffect(() => changeAvgMark(id, avgMark, reviews.length), [reviews]);

    const openModal = () => {
        if (!user) return router.push("/sign-in");

        setOpen(true);
        document.scrollingElement.style.overflow = "hidden";
    }

    const renderReviews = () => reviews.map(item => {
        const { id, userId, name, surname, mark, reviewText, reviewDate } = item;

        const openModalForEdit = () => {
            setReview(item);
            openModal();
        }

        const dateStr = new Date(reviewDate).toLocaleDateString("ru-RU");

        return (
            <li key={id} className={styles.review}>
                <div className={styles.reviewMain}>
                    <p style={{fontWeight: 600}}>{mark}</p>
                    <div className={styles.vertical}/>
                    <p>{name} {surname}</p>
                    <div className={styles.vertical}/>
                    <p>{dateStr}</p>
                    <EditIcon
                        style={{
                            display: user?.id === userId ? "block" : "none",
                            cursor: "pointer"
                        }}
                        onClick={openModalForEdit}
                        fontSize="small"/>
                </div>
                <p style={{marginTop: "10px"}}>{reviewText}</p>
            </li>
        );
    });

    switch (queryState) {
        case "pending": return <TourLoading/>;
        case "error": return (
            <div>
                <p style={{color: "red"}}>Произошла ошибка</p>
                <button className={styles.btn} onClick={getReviews}>Попробовать снова</button>
            </div>
        );
    }

    const reviewsEls = renderReviews();
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
                {!isAdmin && 
                <button className={styles.btn} onClick={openModal}>Оставить отзыв</button>}
                <ReviewModal
                    open={open}
                    setOpen={setOpen}
                    setReviews={setReviews}
                    review={review}
                    setReview={setReview}
                    tourId={id}/>
            </div>
            <ul className={styles.reviewsList}>{reviewsEls}</ul>
        </div>
    );
}

export default TourReviews;
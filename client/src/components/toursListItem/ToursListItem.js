'use client';

import { BASE_URL } from "@/env";
import styles from "./toursListItem.module.css";
import { useAdmin, useTours, useToken } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";
import Link from "next/link";
import DisplayStars from "../displayStars/DisplayStars";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminSpinner from "../loadingSpinners/AdminSpinner";
import { reviewStr } from "../tourReviews/TourReviews";

const ToursListItem = ({ tour }) => {
    const {
        id, tourTitle, destinationCountry: country, hotel,
        avgMark, amount: marksAmount, basePrice: price
    } = tour;
    const { hotelTitle, resort, photo, stars } = hotel;
    const { isAdmin } = useAdmin();
    const { deleteTour } = useTours();
    const { token } = useToken();
    const { query, queryState, resetQueryState } = useQuery();

    const removeTour = () => {
        query(`${BASE_URL}/tour/delete/${id}`, "DELETE", {'authorization': `Bearer ${token}`})
            .then(() => setTimeout(() => deleteTour(id), 2000))
            .finally(() => setTimeout(resetQueryState, 2000));
    }

    const renderQueryState = () => {
        if (queryState === "idle") return null;
        if (queryState === "pending") return <AdminSpinner/>;

        const isError = queryState === "error";

        return (
            <p style={{color: isError ? "red" : "green"}}>
                {isError ? "Произошла ошибка" : "Тур удалён"}
            </p>
        );
    }
    
    return (
        <>
        <li className={styles.listItem}>
            <img 
                src={`${BASE_URL}/uploads/${country}/${resort}/${hotelTitle}/${photo}`}
                alt={`${hotelTitle} photo`}
                className={styles.photo}/>
            <div className={styles.info}>
                <div className={styles.topInfo}>
                    <p className={styles.title}>{tourTitle}</p>
                    <p>от <span className={styles.price}>${price}</span>/ночь</p>
                </div>
                <p>{country}, {resort}</p>
                <p>{hotelTitle}</p>
                <DisplayStars stars={stars}/>
                <div className={styles.marks}>
                    <p className={styles.mark}>{avgMark.toFixed(1)}</p>
                    <p>{reviewStr(marksAmount)}</p>
                </div>
                <div className={styles.btnWrapper}>
                    <Link href={`/tours/${id}`} className={styles.link}>
                        <button className={styles.btn}>Посмотреть тур</button>
                    </Link>
                    {isAdmin &&
                    <>
                    <Link href={`/admin/edit-tour/${id}`}>
                        <EditIcon/>
                    </Link>
                    <DeleteIcon style={{cursor: "pointer"}} onClick={removeTour}/>
                    </>}
                </div>
            </div>
        </li>
        {renderQueryState()}
        </>
    );
}

export default ToursListItem;
import styles from "./bookingItem.module.css";
import Link from "next/link";

const options = {
    weekday: "short",
    month: "short",
    day: "numeric"
};

const BookingItem = ({ booking, showStatus = false }) => {
    const {
        nutritionType, roomType, adultsAmount, childrenAmount, status,
        tourId, startDate, endDate, tourTitle, hotelTitle, totalPrice
    } = booking;

    const startDateStr = new Date(startDate).toLocaleDateString("ru-RU", options);
    const endDateStr = new Date(endDate).toLocaleDateString("ru-RU", options);

    const itemArr = [
        ["Тур", tourTitle], ["Начало", startDateStr], ["Конец", endDateStr],
        ["Отель", hotelTitle], ["Тип номера", roomType], ["Тип питания", nutritionType],
        ["Кол-во взрослых", adultsAmount], ["Кол-во детей", childrenAmount]
    ];

    return (
        <div className={styles.bookingItem}>
            {itemArr.map(([title, info]) =>
            <div key={title} className={styles.infoItem}>
                <p className={styles.title}>{title}</p>
                <p className={styles.info}>{info}</p>
            </div>)}
            <div className={styles.infoItem}>
                <p className={styles.title}>Цена</p>
                <p className={styles.price}>${totalPrice}</p>
            </div>
            {showStatus &&
            <div className={styles.infoItem}>
                <p className={styles.title}>Статус</p>
                <p className={styles.info}>{status}</p>
            </div>
            }
            <div>
                <Link href={`/tours/${tourId}`}>
                    <button className={styles.btn}>Посмотреть тур</button>
                </Link>
            </div>
        </div>
    );
}

export default BookingItem;
'use client';

import styles from "./bookTourModal.module.css";
import { Modal, Box } from "@mui/material";
import BookForm from "../bookForm/BookForm";
import { useState } from "react";
import { useAdmin, useUser } from "../GlobalContext";
import { useRouter } from "next/navigation";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
};

const BookTourModal = ({ id, roomTypes, nutrTypes, basePrice }) => {
    const [open, setOpen] = useState(false);
    const [canClose, setCanClose] = useState(true);
    const { isAdmin } = useAdmin();
    const { user } = useUser();
    const router = useRouter();

    const handleOpen = () => {
        if (!user) return router.push("/sign-in");

        setOpen(true);
        document.scrollingElement.style.overflow = "hidden";
    }

    const handleClose = () => {
        if (!canClose) return;

        setOpen(false);
        document.scrollingElement.style.overflow = "auto";
    }

    return (
        <div>
            {!isAdmin && <button className={styles.btn} onClick={handleOpen}>Забронировать</button>}
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style} className={styles.modalContent}>
                    <p className={styles.close} onClick={handleClose}>+</p>
                    <BookForm
                        id={id}
                        roomTypes={roomTypes}
                        nutrTypes={nutrTypes}
                        basePrice={basePrice}
                        setCanClose={setCanClose}
                        handleClose={handleClose}/>
                </Box>
            </Modal>
        </div>
    );
}

export default BookTourModal;
'use client';

import styles from "../bookTourModal/bookTourModal.module.css";
import { Modal, Box } from "@mui/material";
import { useState } from "react";
import ReviewForm from "../reviewForm/ReviewForm";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 768,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
};

const ReviewModal = ({ open, setOpen, setReviews, review, setReview, tourId }) => {
    const [canClose, setCanClose] = useState(true);
    
    const handleClose = () => {
        if (!canClose) return;

        setOpen(false);
        setReview(null);
        document.scrollingElement.style.overflow = "auto";
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style} className={styles.modalContent}>
                <p className={styles.close} onClick={handleClose}>+</p>
                <ReviewForm
                    setReviews={setReviews}
                    review={review}
                    tourId={tourId}
                    setCanClose={setCanClose}
                    handleClose={handleClose}/>
            </Box>
        </Modal>
    );
}

export default ReviewModal;
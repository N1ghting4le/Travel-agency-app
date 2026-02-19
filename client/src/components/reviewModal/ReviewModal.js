"use client";

import styles from "../bookTourModal/bookTourModal.module.css";
import { Modal, Box } from "@mui/material";
import { useState } from "react";
import ReviewForm from "../reviewForm/ReviewForm";
import { boxStyle } from "./constants";

const ReviewModal = ({
  open,
  setOpen,
  setReviews,
  review,
  setReviewIndex,
  tourId,
}) => {
  const [canClose, setCanClose] = useState(true);

  const handleClose = () => {
    if (!canClose) {
      return;
    }

    setOpen(false);
    setReviewIndex(null);
    document.scrollingElement.style.overflow = "auto";
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={boxStyle} className={styles.modalContent}>
        <p className={styles.close} onClick={handleClose}>
          +
        </p>
        <ReviewForm
          setReviews={setReviews}
          review={review}
          tourId={tourId}
          setCanClose={setCanClose}
          handleClose={handleClose}
        />
      </Box>
    </Modal>
  );
};

export default ReviewModal;

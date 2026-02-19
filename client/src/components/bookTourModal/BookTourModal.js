"use client";

import styles from "./bookTourModal.module.css";
import { Modal, Box } from "@mui/material";
import BookForm from "../bookForm/BookForm";
import { useState } from "react";
import { useAdmin } from "../globalContext/hooks/useAdmin";
import { useUser } from "../globalContext/hooks/useUser";
import { useRouter } from "next/navigation";
import { boxStyle } from "./constants";

const BookTourModal = ({ id, roomTypes, nutrTypes, basePrice }) => {
  const [open, setOpen] = useState(false);
  const [canClose, setCanClose] = useState(true);
  const { isAdmin } = useAdmin();
  const { user } = useUser();
  const router = useRouter();

  const handleOpen = () => {
    if (user) {
      setOpen(true);
      document.scrollingElement.style.overflow = "hidden";
    } else {
      router.push("/sign-in");
    }
  };

  const handleClose = () => {
    if (canClose) {
      setOpen(false);
      document.scrollingElement.style.overflow = "auto";
    }
  };

  return (
    <div>
      {!isAdmin && (
        <button className={styles.btn} onClick={handleOpen}>
          Забронировать
        </button>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box sx={boxStyle} className={styles.modalContent}>
          <p className={styles.close} onClick={handleClose}>
            +
          </p>
          <BookForm
            id={id}
            roomTypes={roomTypes}
            nutrTypes={nutrTypes}
            basePrice={basePrice}
            setCanClose={setCanClose}
            handleClose={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default BookTourModal;

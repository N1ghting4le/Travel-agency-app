import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import styles from "./styles.module.css";

export function Pagination({ page, setPage, pagination }) {
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={handlePrevPage}
        disabled={page === 0}
        className={styles.btn}
      >
        <ChevronLeft />
      </button>
      <span>
        {page + 1} из {pagination.totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={page === pagination.totalPages - 1}
        className={styles.btn}
      >
        <ChevronRight />
      </button>
      <p>
        элементы {pagination.offset + 1} -{" "}
        {pagination.offset + pagination.numberOfElements} из{" "}
        {pagination.totalElements}
      </p>
    </div>
  );
}

package com.example.kursach_server.repository;

import com.example.kursach_server.dto.review.AvgMarkAndReviewsAmountProjection;
import com.example.kursach_server.models.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    Page<Review> findByTourId(UUID tourId, Pageable pageable);
    Optional<Review> findFirstByUserEmailAndTourIdOrderByReviewDateDesc(String email, UUID tourId);

    @Query(
        "SELECT COALESCE(AVG(review.mark), 0) as avgMark, COUNT(review) as reviewsAmount " +
        "FROM Review review WHERE review.tour.id = :tourId"
    )
    AvgMarkAndReviewsAmountProjection getAvgMarkAndReviewsAmountByTourId(@Param("tourId") UUID tourId);
}

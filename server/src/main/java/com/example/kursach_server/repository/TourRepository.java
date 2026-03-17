package com.example.kursach_server.repository;

import com.example.kursach_server.models.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TourRepository extends JpaRepository<Tour, UUID> {
    @Query(
        "SELECT tour FROM Tour tour WHERE tour.departureCity = :departureCity " +
        "AND tour.destinationCountry = :destinationCountry " +
        "AND tour.hotel.stars >= :hotelStars " +
        "AND (tour.delete IS NULL OR tour.delete = false)"
    )
    List<Tour> findByCriteria(
        @Param("departureCity") String departureCity,
        @Param("destinationCountry") String destinationCountry,
        @Param("hotelStars") Integer hotelStars
    );

    List<Tour> findByDeleteIsTrue();

    @Query(
        value = "SELECT t.id, " +
        "t.tour_title, " +
        "t.destination_country, " +
        "r.resort_title, " +
        "COUNT(b.id) as total_bookings, " +
        "COALESCE(SUM(b.total_price), 0) as total_amount " +
        "FROM tours t " +
        "JOIN hotels h ON t.hotel_id = h.id " +
        "JOIN resorts r ON h.resort_id = r.id " +
        "LEFT JOIN bookings b ON t.id = b.tour_id " +
        "WHERE (:year IS NULL OR EXTRACT(YEAR FROM b.booking_date) = :year) " +
        "AND (:month IS NULL OR EXTRACT(MONTH FROM b.booking_date) - 1 = :month) " +
        "AND (:country IS NULL OR t.destination_country = :country) " +
        "GROUP BY t.id, t.tour_title, t.destination_country, r.resort_title " +
        "ORDER BY total_amount DESC, total_bookings DESC " +
        "LIMIT :pageSize OFFSET :offset",
        nativeQuery = true
    )
    List<Object[]> findTourStats(
        @Param("year") Integer year,
        @Param("month") Integer month,
        @Param("country") String country,
        @Param("pageSize") int pageSize,
        @Param("offset") long offset
    );

    @Query(
        value = "SELECT COUNT(DISTINCT t.id) " +
        "FROM tours t " +
        "LEFT JOIN bookings b ON t.id = b.tour_id " +
        "WHERE (:year IS NULL OR EXTRACT(YEAR FROM b.booking_date) = :year) " +
        "AND (:month IS NULL OR EXTRACT(MONTH FROM b.booking_date) - 1 = :month) " +
        "AND (:country IS NULL OR t.destination_country = :country)",
        nativeQuery = true
    )
    long countTourStats(
        @Param("year") Integer year,
        @Param("month") Integer month,
        @Param("country") String country
    );
}

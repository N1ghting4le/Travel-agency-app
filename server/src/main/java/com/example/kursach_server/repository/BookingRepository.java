package com.example.kursach_server.repository;

import com.example.kursach_server.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUserId(UUID userId);
    Optional<Booking> findFirstByUserEmailAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        String email,
        Date endDate,
        Date startDate
    );
    List<Booking> findByBookingDateBetweenAndEmployeeIsNullOrderByBookingDateAsc(Date startDate, Date endDate);
    List<Booking> findByEmployeeId(UUID employeeId);
    boolean existsByUserIdAndTourIdAndEndDateLessThanEqual(UUID userId, UUID tourId, Date date);

    @Query(
        value = "SELECT EXTRACT(MONTH FROM b.booking_date) - 1 as month, SUM(b.total_price) as total " +
        "FROM bookings b " +
        "JOIN tours t ON b.tour_id = t.id " +
        "WHERE EXTRACT(YEAR FROM b.booking_date) = :year " +
        "AND (:country IS NULL OR t.destination_country = :country) " +
        "GROUP BY EXTRACT(YEAR FROM b.booking_date), EXTRACT(MONTH FROM b.booking_date) " +
        "ORDER BY EXTRACT(MONTH FROM b.booking_date)",
        nativeQuery = true
    )
    List<Object[]> findMonthlyStats(@Param("year") int year, @Param("country") String country);

    @Query(
        value = "SELECT EXTRACT(DAY FROM b.booking_date) as day, " +
        "EXTRACT(MONTH FROM b.booking_date) - 1 as month, " +
        "EXTRACT(YEAR FROM b.booking_date) as year, " +
        "SUM(b.total_price) as total " +
        "FROM bookings b " +
        "JOIN tours t ON b.tour_id = t.id " +
        "WHERE EXTRACT(YEAR FROM b.booking_date) = :year " +
        "AND EXTRACT(MONTH FROM b.booking_date) - 1 = :month " +
        "AND (:country IS NULL OR t.destination_country = :country) " +
        "GROUP BY EXTRACT(YEAR FROM b.booking_date), EXTRACT(MONTH FROM b.booking_date), EXTRACT(DAY FROM b.booking_date) " +
        "ORDER BY EXTRACT(DAY FROM b.booking_date)",
        nativeQuery = true
    )
    List<Object[]> findDailyStats(
        @Param("year") int year,
        @Param("month") int month,
        @Param("country") String country
    );

    @Query(
        value = "SELECT EXTRACT(MONTH FROM b.booking_date) - 1 as month, COUNT(b.id) as count " +
        "FROM bookings b " +
        "JOIN tours t ON b.tour_id = t.id " +
        "WHERE EXTRACT(YEAR FROM b.booking_date) = :year " +
        "AND (:country IS NULL OR t.destination_country = :country) " +
        "GROUP BY EXTRACT(YEAR FROM b.booking_date), EXTRACT(MONTH FROM b.booking_date) " +
        "ORDER BY EXTRACT(MONTH FROM b.booking_date)",
        nativeQuery = true
    )
    List<Object[]> findMonthlyCounts(@Param("year") int year, @Param("country") String country);

    @Query(
        value = "SELECT EXTRACT(DAY FROM b.booking_date) as day, " +
        "EXTRACT(MONTH FROM b.booking_date) - 1 as month, " +
        "EXTRACT(YEAR FROM b.booking_date) as year, " +
        "COUNT(b.id) as count " +
        "FROM bookings b " +
        "JOIN tours t ON b.tour_id = t.id " +
        "WHERE EXTRACT(YEAR FROM b.booking_date) = :year " +
        "AND EXTRACT(MONTH FROM b.booking_date) - 1 = :month " +
        "AND (:country IS NULL OR t.destination_country = :country) " +
        "GROUP BY EXTRACT(YEAR FROM b.booking_date), EXTRACT(MONTH FROM b.booking_date), EXTRACT(DAY FROM b.booking_date) " +
        "ORDER BY EXTRACT(DAY FROM b.booking_date)",
        nativeQuery = true
    )
    List<Object[]> findDailyCounts(
        @Param("year") int year,
        @Param("month") int month,
        @Param("country") String country
    );

    @Query(
        value = "SELECT COUNT(b.id), COALESCE(SUM(b.total_price), 0) " +
        "FROM bookings b " +
        "JOIN tours t ON b.tour_id = t.id " +
        "WHERE EXTRACT(YEAR FROM b.booking_date) = :year " +
        "AND (:country IS NULL OR t.destination_country = :country)",
        nativeQuery = true
    )
    Object[][] findYearlySummary(@Param("year") int year, @Param("country") String country);

    @Query(
        value = "SELECT COUNT(b.id), COALESCE(SUM(b.total_price), 0) " +
        "FROM bookings b " +
        "JOIN tours t ON b.tour_id = t.id " +
        "WHERE EXTRACT(YEAR FROM b.booking_date) = :year " +
        "AND EXTRACT(MONTH FROM b.booking_date) - 1 = :month " +
        "AND (:country IS NULL OR t.destination_country = :country)",
        nativeQuery = true
    )
    Object[][] findMonthlySummary(
        @Param("year") int year,
        @Param("month") int month,
        @Param("country") String country
    );
}

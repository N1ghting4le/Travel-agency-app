package com.example.kursach_server.repository;

import com.example.kursach_server.constants.BookingStatuses;
import com.example.kursach_server.models.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUserIdOrderByBookingDateDesc(UUID userId);
    Optional<Booking> findFirstByUserEmailAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        String email,
        Date endDate,
        Date startDate
    );

    @Query(
        value = "SELECT b FROM Booking b WHERE b.status = '" + BookingStatuses.UNDER_CONSIDERATION + "' " +
        "AND b.bookingDate BETWEEN :startDate AND :endDate " +
        "AND LOWER(b.user.email) LIKE %:email% AND b.user.phoneNumber LIKE %:phoneNumber%",
        countQuery = "SELECT COUNT(b) FROM Booking b WHERE b.status = '" + BookingStatuses.UNDER_CONSIDERATION + "' " +
        "AND b.bookingDate BETWEEN :startDate AND :endDate " +
        "AND LOWER(b.user.email) LIKE %:email% AND b.user.phoneNumber LIKE %:phoneNumber%"
    )
    Page<Booking> findNewBookingsByParams(
        @Param("startDate") Date startDate,
        @Param("endDate") Date endDate,
        @Param("email") String email,
        @Param("phoneNumber") String phoneNumber,
        Pageable pageable
    );

    @Query(
        value = "SELECT b FROM Booking b WHERE b.startDate > :today " +
        "AND b.bookingDate BETWEEN :startDate AND :endDate " +
        "AND LOWER(b.user.email) LIKE %:email% AND b.user.phoneNumber LIKE %:phoneNumber% " +
        "AND b.employee.id = :employeeId",
        countQuery = "SELECT COUNT(b) FROM Booking b WHERE b.startDate > :today " +
        "AND b.bookingDate BETWEEN :startDate AND :endDate " +
        "AND LOWER(b.user.email) LIKE %:email% AND b.user.phoneNumber LIKE %:phoneNumber% " +
        "AND b.employee.id = :employeeId"
    )
    Page<Booking> findTakenByParams(
        @Param("today") Date today,
        @Param("startDate") Date startDate,
        @Param("endDate") Date endDate,
        @Param("email") String email,
        @Param("phoneNumber") String phoneNumber,
        @Param("employeeId") UUID employeeId,
        Pageable pageable
    );

    boolean existsByUserIdAndTourIdAndStatus(UUID userId, UUID tourId, String status);

    @Modifying
    @Query(
        "UPDATE Booking b SET b.status = '" + BookingStatuses.REJECTED + "' " +
        "WHERE b.status IN ('" + BookingStatuses.UNDER_CONSIDERATION + "', '" + BookingStatuses.TAKEN + "') " +
        "AND b.startDate <= :today"
    )
    void rejectExpiredBookings(@Param("today") Date today);

    @Modifying
    @Query(
        "UPDATE Booking b SET b.status = '" + BookingStatuses.IN_PROGRESS + "' " +
        "WHERE b.status = '" + BookingStatuses.APPROVED + "' " +
        "AND b.startDate <= :today"
    )
    void startApprovedBookings(@Param("today") Date today);

    @Modifying
    @Query(
        "UPDATE Booking b SET b.status = '" + BookingStatuses.COMPLETED + "' " +
        "WHERE b.status = '" + BookingStatuses.IN_PROGRESS + "' " +
        "AND b.endDate <= :today"
    )
    void completeStartedBookings(@Param("today") Date today);

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

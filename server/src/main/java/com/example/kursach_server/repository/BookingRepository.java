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
            String email, Date endDate, Date startDate);
    List<Booking> findByBookingDateBetweenAndEmployeeIsNullOrderByBookingDateAsc(Date startDate, Date endDate);
    List<Booking> findByEmployeeId(UUID employeeId);
    // Для статистики по месяцам года (стоимости)
    @Query(value = "SELECT EXTRACT(MONTH FROM b.booking_date) - 1 as month, SUM(b.total_price) as total " +
            "FROM bookings b " +
            "JOIN tours t ON b.tour_id = t.id " +
            "WHERE EXTRACT(YEAR FROM b.booking_date) = :year " +
            "AND (:country IS NULL OR t.destination_country = :country) " +
            "GROUP BY EXTRACT(YEAR FROM b.booking_date), EXTRACT(MONTH FROM b.booking_date) " +
            "ORDER BY EXTRACT(MONTH FROM b.booking_date)",
            nativeQuery = true)
    List<Object[]> findMonthlyStats(@Param("year") int year,
                                    @Param("country") String country);

    // Для статистики по дням месяца (стоимости)
    @Query(value = "SELECT EXTRACT(DAY FROM b.booking_date) as day, " +
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
            nativeQuery = true)
    List<Object[]> findDailyStats(@Param("year") int year,
                                  @Param("month") int month,
                                  @Param("country") String country);

    // Для количества по месяцам года
    @Query(value = "SELECT EXTRACT(MONTH FROM b.booking_date) - 1 as month, COUNT(b.id) as count " +
            "FROM bookings b " +
            "JOIN tours t ON b.tour_id = t.id " +
            "WHERE EXTRACT(YEAR FROM b.booking_date) = :year " +
            "AND (:country IS NULL OR t.destination_country = :country) " +
            "GROUP BY EXTRACT(YEAR FROM b.booking_date), EXTRACT(MONTH FROM b.booking_date) " +
            "ORDER BY EXTRACT(MONTH FROM b.booking_date)",
            nativeQuery = true)
    List<Object[]> findMonthlyCounts(@Param("year") int year,
                                     @Param("country") String country);

    // Для количества по дням месяца
    @Query(value = "SELECT EXTRACT(DAY FROM b.booking_date) as day, " +
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
            nativeQuery = true)
    List<Object[]> findDailyCounts(@Param("year") int year,
                                   @Param("month") int month,
                                   @Param("country") String country);

    // Сводная статистика за год
    @Query(value = "SELECT COUNT(b.id), COALESCE(SUM(b.total_price), 0) " +
            "FROM bookings b " +
            "JOIN tours t ON b.tour_id = t.id " +
            "WHERE EXTRACT(YEAR FROM b.booking_date) = :year " +
            "AND (:country IS NULL OR t.destination_country = :country)",
            nativeQuery = true)
    Object[][] findYearlySummary(@Param("year") int year,
                               @Param("country") String country);

    // Сводная статистика за месяц
    @Query(value = "SELECT COUNT(b.id), COALESCE(SUM(b.total_price), 0) " +
            "FROM bookings b " +
            "JOIN tours t ON b.tour_id = t.id " +
            "WHERE EXTRACT(YEAR FROM b.booking_date) = :year " +
            "AND EXTRACT(MONTH FROM b.booking_date) - 1 = :month " +
            "AND (:country IS NULL OR t.destination_country = :country)",
            nativeQuery = true)
    Object[][] findMonthlySummary(@Param("year") int year,
                                @Param("month") int month,
                                @Param("country") String country);

    @Query(value = "SELECT t.id, " +
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
            nativeQuery = true)
    List<Object[]> findTourStats(@Param("year") Integer year,
                                 @Param("month") Integer month,
                                 @Param("country") String country,
                                 @Param("pageSize") int pageSize,
                                 @Param("offset") long offset);

    @Query(value = "SELECT COUNT(DISTINCT t.id) " +
            "FROM tours t " +
            "LEFT JOIN bookings b ON t.id = b.tour_id " +
            "WHERE (:year IS NULL OR EXTRACT(YEAR FROM b.booking_date) = :year) " +
            "AND (:month IS NULL OR EXTRACT(MONTH FROM b.booking_date) - 1 = :month) " +
            "AND (:country IS NULL OR t.destination_country = :country)",
            nativeQuery = true)
    long countTourStats(@Param("year") Integer year,
                        @Param("month") Integer month,
                        @Param("country") String country);
}

package com.example.kursach_server.repository;

import com.example.kursach_server.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

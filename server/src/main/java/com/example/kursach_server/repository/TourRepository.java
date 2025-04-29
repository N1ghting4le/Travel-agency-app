package com.example.kursach_server.repository;

import com.example.kursach_server.models.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface TourRepository extends JpaRepository<Tour, UUID> {
    List<Tour> findByDepartureCityAndDestinationCountryAndHotelStarsGreaterThanEqualAndDeleteIsNull(
            String departureCity, String destinationCountry, int stars);
    List<Tour> findByDeleteIsTrue();
}

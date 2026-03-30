package com.example.kursach_server.repository;

import com.example.kursach_server.models.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, UUID> {
    List<Hotel> findByResortResortCountry(String hotelCountry);
    List<Hotel> findByResortResortCountryAndStarsGreaterThanEqual(String hotelCountry, int stars);
    boolean existsByResortIdAndHotelTitle(UUID resortId, String hotelCountry);

    @Query(
        value = "SELECT hotel FROM Hotel hotel WHERE LOWER(hotel.hotelTitle) LIKE %:hotelTitle%",
        countQuery = "SELECT COUNT(hotel) FROM Hotel hotel WHERE LOWER(hotel.hotelTitle) LIKE %:hotelTitle%"
    )
    Page<Hotel> findByCriteria(
        @Param("hotelTitle") String hotelTitle,
        Pageable pageable
    );
}

package com.example.kursach_server.repository;

import com.example.kursach_server.models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface HotelRepository extends JpaRepository<Hotel, UUID> {
    List<Hotel> findByResortResortCountry(String hotelCountry);
}

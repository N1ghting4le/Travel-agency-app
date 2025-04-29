package com.example.kursach_server.repository;

import com.example.kursach_server.models.Resort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResortRepository extends JpaRepository<Resort, UUID> {
    List<Resort> findByResortCountry(String country);
    Optional<Resort> findByResortTitleAndResortCountry(String title, String country);
}

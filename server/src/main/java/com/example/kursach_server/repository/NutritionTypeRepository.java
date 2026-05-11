package com.example.kursach_server.repository;

import com.example.kursach_server.models.NutritionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface NutritionTypeRepository extends JpaRepository<NutritionType, UUID> {
    Optional<NutritionType> findByName(String name);
}

package com.example.kursach_server.repository;

import com.example.kursach_server.models.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoomTypeRepository extends JpaRepository<RoomType, UUID> {
    Optional<RoomType> findByName(String name);
}

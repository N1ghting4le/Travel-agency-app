package com.example.kursach_server.models;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "nutrition_types")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class NutritionType {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "nutritionTypes")
    private List<Hotel> hotels;

    @OneToMany(mappedBy = "nutritionType")
    private List<Booking> bookings;

    public NutritionType() {}
}

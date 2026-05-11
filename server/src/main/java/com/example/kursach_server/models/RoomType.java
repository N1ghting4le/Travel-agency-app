package com.example.kursach_server.models;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "room_types")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "roomTypes")
    private List<Hotel> hotels;

    @OneToMany(mappedBy = "roomType")
    private List<Booking> bookings;

    public RoomType() {}
}

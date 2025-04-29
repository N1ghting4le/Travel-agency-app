package com.example.kursach_server.models;

import static jakarta.persistence.GenerationType.UUID;

import com.example.kursach_server.dto.tour.CreateTourDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tours")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Tour {
    @Id
    @GeneratedValue(strategy = UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne
    @NotNull
    private Hotel hotel;

    @Column(nullable = false, columnDefinition = "text")
    private String departureCity;

    @Column(nullable = false, columnDefinition = "text")
    private String destinationCountry;

    @Column(nullable = false, columnDefinition = "double precision")
    private double basePrice;

    @Column(nullable = false, columnDefinition = "text")
    private String tourTitle;

    @Column(columnDefinition = "text")
    private String tourDescr;

    @Column(columnDefinition = "text")
    private String tourNotes;

    @Column(columnDefinition = "boolean")
    private Boolean delete;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Booking> bookings = new ArrayList<>();

    public Tour() {}
    public Tour(CreateTourDTO tourDTO) {
        departureCity = tourDTO.getDepartureCity();
        destinationCountry = tourDTO.getDestinationCountry();
        basePrice = tourDTO.getBasePrice();
        tourTitle = tourDTO.getTourTitle();
        tourDescr = tourDTO.getTourDescr();
        tourNotes = tourDTO.getTourNotes();
    }
}

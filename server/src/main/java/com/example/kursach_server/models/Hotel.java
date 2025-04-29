package com.example.kursach_server.models;

import static jakarta.persistence.GenerationType.UUID;

import com.example.kursach_server.dto.hotel.CreateHotelDTO;
import com.vladmihalcea.hibernate.type.array.StringArrayType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.util.*;

@Entity
@Table(name = "hotels")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Hotel {
    @Id
    @GeneratedValue(strategy = UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne
    @NotNull
    private Resort resort;

    @Column(nullable = false, columnDefinition = "text")
    private String hotelTitle;

    @Column(nullable = false, columnDefinition = "text")
    private String address;

    @Column(nullable = false, columnDefinition = "text")
    private String hotelDescr;

    @Type(StringArrayType.class)
    @Column(name = "nutrition_types", columnDefinition = "text[]", nullable = false)
    private String[] nutritionTypes;

    @Type(StringArrayType.class)
    @Column(name = "room_types", columnDefinition = "text[]", nullable = false)
    private String[] roomTypes;

    @Column(nullable = false, columnDefinition = "integer")
    private int stars;

    @Type(StringArrayType.class)
    @Column(name = "photos", columnDefinition = "text[]", nullable = false)
    private String[] photos;

    @Column(columnDefinition = "text")
    private String hotelNotes;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tour> tours = new ArrayList<>();

    public Hotel() {}
    public Hotel(CreateHotelDTO hotelDTO, List<String> photoNames) {
        hotelTitle = hotelDTO.getTitle();
        address = hotelDTO.getAddress();
        hotelDescr = hotelDTO.getDescr();
        nutritionTypes = hotelDTO.getNutritionTypes().toArray(String[]::new);
        roomTypes = hotelDTO.getRoomTypes().toArray(String[]::new);
        stars = hotelDTO.getStars();
        photos = photoNames.toArray(String[]::new);
        hotelNotes = hotelDTO.getNotes();
    }
}

package com.example.kursach_server.models;

import com.example.kursach_server.dto.resort.CreateResortDTO;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static jakarta.persistence.GenerationType.UUID;

@Entity
@Table(name = "resorts")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Resort {
    @Id
    @GeneratedValue(strategy = UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false, columnDefinition = "text")
    private String resortTitle;

    @Column(nullable = false, columnDefinition = "text")
    private String resortCountry;

    @OneToMany(mappedBy = "resort", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Hotel> hotels = new ArrayList<>();
    public Resort() {}
    public Resort(CreateResortDTO createResortDTO) {
        resortCountry = createResortDTO.getCountry();
        resortTitle = createResortDTO.getResort();
    }
}

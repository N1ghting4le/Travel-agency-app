package com.example.kursach_server.models;

import static jakarta.persistence.GenerationType.UUID;

import com.example.kursach_server.dto.review.CreateReviewDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Review {
    @Id
    @GeneratedValue(strategy = UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne
    @NotNull
    private User user;

    @ManyToOne
    @NotNull
    private Tour tour;

    @Column(nullable = false, columnDefinition = "date")
    @Temporal(TemporalType.DATE)
    private Date reviewDate;

    @Column(nullable = false, columnDefinition = "integer")
    private int mark;

    @Column(nullable = false, columnDefinition = "text")
    private String reviewText;
    public Review() {}
    public Review(CreateReviewDTO createReviewDTO) {
        mark = createReviewDTO.getMark();
        reviewText = createReviewDTO.getReviewText();
        reviewDate = new Date();
    }
}

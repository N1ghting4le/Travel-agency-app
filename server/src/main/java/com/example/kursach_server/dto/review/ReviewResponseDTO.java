package com.example.kursach_server.dto.review;

import com.example.kursach_server.models.Review;
import com.example.kursach_server.models.User;
import lombok.Getter;

import java.util.Date;
import java.util.UUID;

@Getter
public class ReviewResponseDTO {
    private final UUID id;
    private final UUID userId;
    private final String name;
    private final String surname;
    private final int mark;
    private final String reviewText;
    private final Date reviewDate;

    public ReviewResponseDTO(Review review) {
        User user = review.getUser();

        id = review.getId();
        userId = user.getId();
        name = user.getName();
        surname = user.getSurname();
        mark = review.getMark();
        reviewText = review.getReviewText();
        reviewDate = review.getReviewDate();
    }
}

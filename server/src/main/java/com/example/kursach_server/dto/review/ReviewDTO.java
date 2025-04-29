package com.example.kursach_server.dto.review;

import com.example.kursach_server.models.Review;
import com.example.kursach_server.models.User;
import lombok.Getter;

import java.util.Date;
import java.util.UUID;

@Getter
public class ReviewDTO {
    private UUID id;
    private UUID userId;
    private String name;
    private String surname;
    private int mark;
    private String reviewText;
    private Date reviewDate;
    public ReviewDTO(Review review) {
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

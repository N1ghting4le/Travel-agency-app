package com.example.kursach_server.controllers;

import com.example.kursach_server.dto.review.CreateReviewDTO;
import com.example.kursach_server.dto.review.ReviewDTO;
import com.example.kursach_server.dto.review.UpdateReviewDTO;
import com.example.kursach_server.exceptions.forbidden.EarlyReviewAttemptException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.forbidden.NotSameUserException;
import com.example.kursach_server.service.ReviewService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/review")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;
    @GetMapping("/get/{id}")
    public List<ReviewDTO> getTourReviews(@Valid @PathVariable @NotNull UUID id) {
        return reviewService.getTourReviews(id);
    }
    @PostMapping("/create")
    @RolesAllowed({"USER", "EMPL"})
    public ReviewDTO createReview(@Valid @RequestBody CreateReviewDTO createReviewDTO, HttpServletRequest request)
            throws EntityNotFoundException, EarlyReviewAttemptException {
        return reviewService.createReview(createReviewDTO, request);
    }
    @PatchMapping("/update")
    @RolesAllowed({"USER", "EMPL"})
    public ReviewDTO updateReview(@Valid @RequestBody UpdateReviewDTO updateReviewDTO, HttpServletRequest request)
            throws EntityNotFoundException, NotSameUserException {
        return reviewService.updateReview(updateReviewDTO, request);
    }
}

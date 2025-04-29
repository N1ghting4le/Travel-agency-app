package com.example.kursach_server.service;

import com.example.kursach_server.dto.review.CreateReviewDTO;
import com.example.kursach_server.dto.review.ReviewDTO;
import com.example.kursach_server.dto.review.UpdateReviewDTO;
import com.example.kursach_server.exceptions.forbidden.EarlyReviewAttemptException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.forbidden.NotSameUserException;
import com.example.kursach_server.models.Review;
import com.example.kursach_server.models.Tour;
import com.example.kursach_server.models.User;
import com.example.kursach_server.repository.ReviewRepository;
import com.example.kursach_server.repository.TourRepository;
import com.example.kursach_server.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TourRepository tourRepository;
    public List<ReviewDTO> getTourReviews(UUID id) {
        return reviewRepository.findByTourIdOrderByReviewDateDesc(id).stream().map(ReviewDTO::new).toList();
    }
    public ReviewDTO createReview(CreateReviewDTO createReviewDTO, HttpServletRequest request)
            throws EntityNotFoundException, EarlyReviewAttemptException {
        String email = (String) request.getAttribute("email");
        Optional<Review> reviewInfo = reviewRepository
                .findFirstByUserEmailOrderByReviewDateDesc(email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));

        if (reviewInfo.isPresent() && new Date().getTime() - reviewInfo.get().getReviewDate().getTime() < 86400000) {
            throw new EarlyReviewAttemptException("Вы можете оставлять не более 1 отзыва в сутки");
        }

        Tour tour = tourRepository.findById(createReviewDTO.getTourId())
                .orElseThrow(() -> new EntityNotFoundException("Тур не найден"));
        Review review = new Review(createReviewDTO);

        review.setUser(user);
        review.setTour(tour);
        user.getReviews().add(review);
        tour.getReviews().add(review);
        reviewRepository.save(review);

        return new ReviewDTO(review);
    }
    public ReviewDTO updateReview(UpdateReviewDTO updateReviewDTO, HttpServletRequest request)
            throws EntityNotFoundException, NotSameUserException {
        Review review = reviewRepository.findById(updateReviewDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Отзыв не найден"));

        if (!Objects.equals(review.getUser().getEmail(), request.getAttribute("email"))) {
            throw new NotSameUserException("Don't try it!");
        }

        review.setMark(updateReviewDTO.getMark());
        review.setReviewText(updateReviewDTO.getReviewText());
        reviewRepository.save(review);

        return new ReviewDTO(review);
    }
}

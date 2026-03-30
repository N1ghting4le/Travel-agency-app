package com.example.kursach_server.service;

import com.example.kursach_server.constants.BookingStatuses;
import com.example.kursach_server.constants.Time;
import com.example.kursach_server.dto.review.*;
import com.example.kursach_server.exceptions.conflict.TourNotFinishedException;
import com.example.kursach_server.exceptions.forbidden.EarlyReviewAttemptException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.forbidden.NotSameUserException;
import com.example.kursach_server.models.Review;
import com.example.kursach_server.models.Tour;
import com.example.kursach_server.models.User;
import com.example.kursach_server.repository.BookingRepository;
import com.example.kursach_server.repository.ReviewRepository;
import com.example.kursach_server.repository.TourRepository;
import com.example.kursach_server.repository.UserRepository;
import com.example.kursach_server.utils.Utils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final TourRepository tourRepository;
    private final BookingRepository bookingRepository;

    public ReviewService(
        ReviewRepository reviewRepository,
        UserRepository userRepository,
        TourRepository tourRepository,
        BookingRepository bookingRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.tourRepository = tourRepository;
        this.bookingRepository = bookingRepository;
    }

    public Page<ReviewResponseDTO> getTourReviews(UUID id, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("reviewDate").descending());
        return reviewRepository.findByTourId(id, pageable).map(ReviewResponseDTO::new);
    }

    public AvgMarkAndReviewsAmountResponseDTO getAvgMarkAndReviewsAmount(UUID id) {
        AvgMarkAndReviewsAmountProjection projection = reviewRepository.getAvgMarkAndReviewsAmountByTourId(id);

        return new AvgMarkAndReviewsAmountResponseDTO(
            projection.getAvgMark(),
            projection.getReviewsAmount()
        );
    }

    public ReviewResponseDTO createReview(CreateReviewDTO createReviewDTO, HttpServletRequest request)
        throws EntityNotFoundException, EarlyReviewAttemptException, TourNotFinishedException {
        String email = Utils.getUserEmail(request);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));
        Tour tour = tourRepository.findById(createReviewDTO.getTourId())
            .orElseThrow(() -> new EntityNotFoundException("Тур не найден"));
        Date now = new Date();

        if (!bookingRepository.existsByUserIdAndTourIdAndStatus(
            user.getId(), tour.getId(), BookingStatuses.COMPLETED
        )) {
            throw new TourNotFinishedException("Вы не можете оставить отзыв не завершив тур");
        }

        Optional<Review> reviewInfo = reviewRepository
            .findFirstByUserEmailAndTourIdOrderByReviewDateDesc(email, tour.getId());

        if (
            reviewInfo.isPresent() &&
            now.getTime() - reviewInfo.get().getReviewDate().getTime() < Time.MS_IN_DAY
        ) {
            throw new EarlyReviewAttemptException("Вы можете оставлять не более 1 отзыва в сутки на 1 тур");
        }

        Review review = new Review(createReviewDTO);

        review.setUser(user);
        review.setTour(tour);
        user.getReviews().add(review);
        tour.getReviews().add(review);
        reviewRepository.save(review);

        return new ReviewResponseDTO(review);
    }

    public ReviewResponseDTO updateReview(UpdateReviewDTO updateReviewDTO, HttpServletRequest request)
        throws EntityNotFoundException, NotSameUserException {
        Review review = reviewRepository.findById(updateReviewDTO.getId())
            .orElseThrow(() -> new EntityNotFoundException("Отзыв не найден"));

        if (!Objects.equals(review.getUser().getEmail(), Utils.getUserEmail(request))) {
            throw new NotSameUserException("Don't try it!");
        }

        review.setMark(updateReviewDTO.getMark());
        review.setReviewText(updateReviewDTO.getReviewText());
        reviewRepository.save(review);

        return new ReviewResponseDTO(review);
    }
}

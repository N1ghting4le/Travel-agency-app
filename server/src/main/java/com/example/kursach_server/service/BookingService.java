package com.example.kursach_server.service;

import com.example.kursach_server.dto.booking.BookingDTO;
import com.example.kursach_server.dto.booking.BookingWithUserInfoDTO;
import com.example.kursach_server.dto.booking.CreateBookingDTO;
import com.example.kursach_server.exceptions.conflict.BookingIntersectionException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.conflict.UnavailableTourException;
import com.example.kursach_server.models.Booking;
import com.example.kursach_server.models.Tour;
import com.example.kursach_server.models.User;
import com.example.kursach_server.repository.BookingRepository;
import com.example.kursach_server.repository.TourRepository;
import com.example.kursach_server.repository.UserRepository;
import com.example.kursach_server.requests.DateRangeRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private TourRepository tourRepository;
    @Autowired
    private UserRepository userRepository;
    public void createBooking(CreateBookingDTO createBookingDTO, HttpServletRequest request)
            throws EntityNotFoundException, UnavailableTourException, BookingIntersectionException {
        String email = (String) request.getAttribute("email");
        Date startDate = createBookingDTO.getStartDate();
        Date endDate = createBookingDTO.getEndDate();
        Tour tour = tourRepository.findById(createBookingDTO.getTourId())
                .orElseThrow(() -> new EntityNotFoundException("Тур не найден"));

        if (tour.getDelete() != null) {
            throw new UnavailableTourException("Тур больше не доступен");
        }

        Optional<Booking> booking = bookingRepository
                .findFirstByUserEmailAndStartDateLessThanEqualAndEndDateGreaterThanEqual(email, endDate, startDate);

        if (booking.isPresent()) {
            throw new BookingIntersectionException("У вас уже есть бронь на эти даты");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));
        Booking newBooking = new Booking(createBookingDTO);

        newBooking.setTour(tour);
        newBooking.setUser(user);
        user.getBookings().add(newBooking);
        tour.getBookings().add(newBooking);
        bookingRepository.save(newBooking);
    }
    public List<BookingDTO> getUserBookings(UUID userId) {
        return bookingRepository.findByUserId(userId).stream().map(BookingDTO::new).toList();
    }
    public List<BookingWithUserInfoDTO> getBookingsInDateRange(DateRangeRequest dateRange) {
        return bookingRepository
                .findByBookingDateBetweenAndEmployeeIsNullOrderByBookingDateAsc(
                        dateRange.getStartDate(), dateRange.getEndDate())
                .stream().map(BookingWithUserInfoDTO::new).toList();
    }
    public void takeBooking(UUID bookingId, HttpServletRequest request) throws EntityNotFoundException {
        String email = (String) request.getAttribute("email");
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Бронь не найдена"));
        User employee = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Сотрудник не найден"));

        booking.setEmployee(employee);
        booking.setStatus("Взято сотрудником");
        employee.getTakenBookings().add(booking);
        bookingRepository.save(booking);
    }
    public void changeStatus(UUID bookingId, String action) throws EntityNotFoundException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Бронь не найдена"));

        booking.setStatus(Objects.equals(action, "approve") ? "Одобрено" : "Отклонено");
        bookingRepository.save(booking);
    }
    public List<BookingWithUserInfoDTO> getBookingsTakenByEmployee(UUID employeeId) {
        return bookingRepository.findByEmployeeId(employeeId).stream().map(BookingWithUserInfoDTO::new).toList();
    }
}

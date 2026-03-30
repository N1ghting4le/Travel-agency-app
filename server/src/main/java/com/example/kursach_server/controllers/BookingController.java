package com.example.kursach_server.controllers;

import com.example.kursach_server.constants.Roles;
import com.example.kursach_server.dto.booking.*;
import com.example.kursach_server.exceptions.conflict.BookingAlreadyTakenException;
import com.example.kursach_server.exceptions.conflict.BookingIntersectionException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.conflict.UnavailableTourException;
import com.example.kursach_server.requests.BookingsRequest;
import com.example.kursach_server.service.BookingService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/booking")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/create")
    @RolesAllowed({Roles.USER, Roles.EMPLOYEE})
    public UUID createBooking(
        @Valid @RequestBody CreateBookingDTO createBookingDTO,
        HttpServletRequest request
    ) throws EntityNotFoundException, UnavailableTourException, BookingIntersectionException {
        return bookingService.createBooking(createBookingDTO, request);
    }

    @GetMapping("/get/{userId}")
    public List<BookingResponseDTO> getUserBookings(@Valid @PathVariable @NotNull UUID userId) {
        return bookingService.getUserBookings(userId);
    }

    @PostMapping("/getByParams")
    @RolesAllowed(Roles.EMPLOYEE)
    public Page<BookingWithUserInfoResponseDTO> getBookingsByParams(
        @Valid @RequestBody BookingsRequest bookingsRequest,
        @RequestParam int page,
        @RequestParam int pageSize
    ) {
        return bookingService.getBookingsByParams(bookingsRequest, page, pageSize);
    }

    @PatchMapping("/take/{id}")
    @RolesAllowed(Roles.EMPLOYEE)
    public void takeBooking(@Valid @PathVariable @NotNull UUID id, HttpServletRequest request)
        throws EntityNotFoundException, BookingAlreadyTakenException {
        bookingService.takeBooking(id, request);
    }

    @PatchMapping("/changeStatus/{id}/{action}")
    @RolesAllowed(Roles.EMPLOYEE)
    public void changeStatus(@Valid @PathVariable @NotNull UUID id, @PathVariable @NotNull String action)
        throws EntityNotFoundException {
        bookingService.changeStatus(id, action);
    }

    @GetMapping("/charts/costs")
    public Object getBookingCosts(
        @RequestParam Integer year,
        @RequestParam(required = false) Integer month,
        @RequestParam(required = false) String country
    ) {
        return bookingService.getBookingStats(year, month, country);
    }

    @GetMapping("/charts/amounts")
    public Object getBookingAmounts(
        @RequestParam Integer year,
        @RequestParam(required = false) Integer month,
        @RequestParam(required = false) String country
    ) {
        return bookingService.getBookingCounts(year, month, country);
    }

    @GetMapping("/summary")
    public SummaryStatsDTO getBookingSummary(
        @RequestParam Integer year,
        @RequestParam(required = false) Integer month,
        @RequestParam(required = false) String country
    ) {
        return bookingService.getBookingSummary(year, month, country);
    }
}

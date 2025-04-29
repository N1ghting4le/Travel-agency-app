package com.example.kursach_server.controllers;

import com.example.kursach_server.dto.booking.BookingDTO;
import com.example.kursach_server.dto.booking.BookingWithUserInfoDTO;
import com.example.kursach_server.dto.booking.CreateBookingDTO;
import com.example.kursach_server.exceptions.conflict.BookingIntersectionException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.conflict.UnavailableTourException;
import com.example.kursach_server.requests.DateRangeRequest;
import com.example.kursach_server.service.BookingService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/booking")
public class BookingController {
    @Autowired
    private BookingService bookingService;
    @PostMapping("/create")
    @RolesAllowed({"USER", "EMPL"})
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody CreateBookingDTO createBookingDTO, HttpServletRequest request)
            throws EntityNotFoundException, UnavailableTourException, BookingIntersectionException {
        bookingService.createBooking(createBookingDTO, request);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/get/{userId}")
    public List<BookingDTO> getUserBookings(@Valid @PathVariable @NotNull UUID userId) {
        return bookingService.getUserBookings(userId);
    }
    @PostMapping("/getByDateRange")
    @RolesAllowed("EMPL")
    public List<BookingWithUserInfoDTO> getBookingsInDateRange(@Valid @RequestBody DateRangeRequest dateRange) {
        return bookingService.getBookingsInDateRange(dateRange);
    }
    @PatchMapping("/take/{id}")
    @RolesAllowed("EMPL")
    public ResponseEntity<?> takeBooking(@Valid @PathVariable @NotNull UUID id, HttpServletRequest request)
            throws EntityNotFoundException {
        bookingService.takeBooking(id, request);
        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/changeStatus/{id}/{action}")
    @RolesAllowed("EMPL")
    public ResponseEntity<?> changeStatus(@Valid @PathVariable @NotNull UUID id, @PathVariable @NotNull String action)
            throws EntityNotFoundException {
        bookingService.changeStatus(id, action);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/getTaken/{employeeId}")
    public List<BookingWithUserInfoDTO> getBookingsTakenByEmployee(@Valid @PathVariable @NotNull UUID employeeId) {
        return bookingService.getBookingsTakenByEmployee(employeeId);
    }
}

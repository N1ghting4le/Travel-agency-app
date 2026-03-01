package com.example.kursach_server.dto.booking;

import com.example.kursach_server.models.Booking;
import com.example.kursach_server.models.Tour;
import lombok.Getter;

import java.util.Date;
import java.util.UUID;

@Getter
public class BookingResponseDTO {
    private final UUID id;
    private final UUID tourId;
    private final String tourTitle;
    private final String nutritionType;
    private final String roomType;
    private final int adultsAmount;
    private final int childrenAmount;
    private final Date startDate;
    private final Date endDate;
    private final Date bookingDate;
    private final String hotelTitle;
    private final double totalPrice;
    private final String status;

    public BookingResponseDTO(Booking booking) {
        Tour tour = booking.getTour();

        id = booking.getId();
        tourId = tour.getId();
        tourTitle = tour.getTourTitle();
        nutritionType = booking.getNutritionType();
        roomType = booking.getRoomType();
        adultsAmount = booking.getAdultsAmount();
        childrenAmount = booking.getChildrenAmount();
        startDate = booking.getStartDate();
        endDate = booking.getEndDate();
        bookingDate = booking.getBookingDate();
        hotelTitle = tour.getHotel().getHotelTitle();
        totalPrice = booking.getTotalPrice();
        status = booking.getStatus();
    }
}

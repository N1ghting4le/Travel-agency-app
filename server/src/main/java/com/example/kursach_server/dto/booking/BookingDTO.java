package com.example.kursach_server.dto.booking;

import com.example.kursach_server.models.Booking;
import com.example.kursach_server.models.Tour;
import lombok.Getter;

import java.util.Date;
import java.util.UUID;

@Getter
public class BookingDTO {
    private UUID id;
    private UUID tourId;
    private String tourTitle;
    private String nutritionType;
    private String roomType;
    private int adultsAmount;
    private int childrenAmount;
    private Date startDate;
    private Date endDate;
    private Date bookingDate;
    private String hotelTitle;
    private double totalPrice;
    private String status;
    public BookingDTO(Booking booking) {
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

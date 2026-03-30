package com.example.kursach_server.dto.tour;

import com.example.kursach_server.constants.BookingStatuses;
import com.example.kursach_server.models.Tour;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
public class TourTableDTO {
    private final UUID id;
    private final String tourTitle;
    private final String departureCity;
    private final String destinationCountry;
    private final String resortTitle;
    private final String hotelTitle;
    private final double basePrice;
    private final Boolean isArchived;
    private final boolean hasBookings;

    public TourTableDTO(Tour tour) {
        id = tour.getId();
        tourTitle = tour.getTourTitle();
        departureCity = tour.getDepartureCity();
        destinationCountry = tour.getDestinationCountry();
        resortTitle = tour.getHotel().getResort().getResortTitle();
        hotelTitle = tour.getHotel().getHotelTitle();
        basePrice = tour.getBasePrice();
        isArchived = tour.getDelete();
        hasBookings = tour.getBookings().stream().anyMatch(booking ->
            !List.of(BookingStatuses.COMPLETED, BookingStatuses.REJECTED).contains(booking.getStatus())
        );
    }
}

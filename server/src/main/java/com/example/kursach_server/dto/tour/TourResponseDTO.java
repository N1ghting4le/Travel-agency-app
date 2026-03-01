package com.example.kursach_server.dto.tour;

import com.example.kursach_server.models.Hotel;
import com.example.kursach_server.models.Tour;
import lombok.Getter;

import java.util.UUID;

@Getter
public class TourResponseDTO {
    private final UUID id;
    private final String tourTitle;
    private final String tourDescr;
    private final String tourNotes;
    private final String departureCity;
    private final String destinationCountry;
    private final double basePrice;
    private final Hotel hotel;

    public TourResponseDTO(Tour tour) {
        id = tour.getId();
        tourTitle = tour.getTourTitle();
        tourDescr = tour.getTourDescr();
        tourNotes = tour.getTourNotes();
        departureCity = tour.getDepartureCity();
        destinationCountry = tour.getDestinationCountry();
        basePrice = tour.getBasePrice();
        hotel = tour.getHotel();
        hotel.setTours(null);
        hotel.getResort().setHotels(null);
    }
}

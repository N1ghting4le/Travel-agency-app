package com.example.kursach_server.dto.tour;

import com.example.kursach_server.models.Hotel;
import com.example.kursach_server.models.Tour;
import lombok.Getter;

import java.util.UUID;

@Getter
public class TourDTO {
    private UUID id;
    private String tourTitle;
    private String tourDescr;
    private String tourNotes;
    private String departureCity;
    private String destinationCountry;
    private double basePrice;
    private Hotel hotel;
    public TourDTO (Tour tour) {
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

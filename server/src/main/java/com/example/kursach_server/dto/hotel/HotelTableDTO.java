package com.example.kursach_server.dto.hotel;

import com.example.kursach_server.models.Hotel;
import lombok.Getter;

import java.util.UUID;

@Getter
public class HotelTableDTO {
    private final UUID id;
    private final String hotelTitle;
    private final String resortCountry;
    private final String resortTitle;
    private final String hotelAddress;
    private final int hotelStars;
    private final boolean hasTours;

    public HotelTableDTO(Hotel hotel) {
        id = hotel.getId();
        hotelTitle = hotel.getHotelTitle();
        resortCountry = hotel.getResort().getResortCountry();
        resortTitle = hotel.getResort().getResortTitle();
        hotelAddress = hotel.getAddress();
        hotelStars = hotel.getStars();
        hasTours = !hotel.getTours().isEmpty();
    }
}

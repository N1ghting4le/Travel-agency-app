package com.example.kursach_server.dto.hotel;

import com.example.kursach_server.dto.resort.ResortLookupDTO;
import com.example.kursach_server.models.Hotel;
import lombok.Getter;

import java.util.UUID;

@Getter
public class HotelResponseDTO {
    private final UUID id;
    private final String hotelTitle;
    private final ResortLookupDTO resort;
    private final String address;
    private final String hotelDescr;
    private final String hotelNotes;
    private final String[] photos;
    private final String[] nutritionTypes;
    private final String[] roomTypes;
    private final int stars;

    public HotelResponseDTO(Hotel hotel) {
        id = hotel.getId();
        hotelTitle = hotel.getHotelTitle();
        resort = new ResortLookupDTO(hotel.getResort());
        address = hotel.getAddress();
        hotelDescr = hotel.getHotelDescr();
        hotelNotes = hotel.getHotelNotes();
        photos = hotel.getPhotos();
        nutritionTypes = hotel.getNutritionTypes();
        roomTypes = hotel.getRoomTypes();
        stars = hotel.getStars();
    }
}

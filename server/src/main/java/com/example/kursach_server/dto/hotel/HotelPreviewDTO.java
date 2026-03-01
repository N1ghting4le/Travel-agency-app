package com.example.kursach_server.dto.hotel;

import com.example.kursach_server.models.Hotel;
import lombok.Getter;

import java.util.UUID;

@Getter
public class HotelPreviewDTO {
    private final UUID id;
    private final String hotelTitle;
    private final String resort;
    private final String photo;
    private final String[] nutritionTypes;
    private final String[] roomTypes;
    private final int stars;

    public HotelPreviewDTO(Hotel hotel) {
        id = hotel.getId();
        hotelTitle = hotel.getHotelTitle();
        resort = hotel.getResort().getResortTitle();
        photo = hotel.getPhotos()[0];
        nutritionTypes = hotel.getNutritionTypes();
        roomTypes = hotel.getRoomTypes();
        stars = hotel.getStars();
    }
}

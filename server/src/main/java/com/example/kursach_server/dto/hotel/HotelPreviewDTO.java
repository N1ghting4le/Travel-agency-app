package com.example.kursach_server.dto.hotel;

import com.example.kursach_server.models.Hotel;
import lombok.Getter;

import java.util.UUID;

@Getter
public class HotelPreviewDTO {
    private UUID id;
    private String hotelTitle;
    private String resort;
    private String photo;
    private String[] nutritionTypes;
    private String[] roomTypes;
    private int stars;
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

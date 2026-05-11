package com.example.kursach_server.dto.hotel;

import com.example.kursach_server.models.Hotel;
import com.example.kursach_server.models.NutritionType;
import com.example.kursach_server.models.RoomType;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
public class HotelPreviewDTO {
    private final UUID id;
    private final String hotelTitle;
    private final String resort;
    private final String photo;
    private final List<String> nutritionTypes;
    private final List<String> roomTypes;
    private final int stars;

    public HotelPreviewDTO(Hotel hotel) {
        id = hotel.getId();
        hotelTitle = hotel.getHotelTitle();
        resort = hotel.getResort().getResortTitle();
        photo = hotel.getPhotos()[0];
        nutritionTypes = hotel.getNutritionTypes().stream().map(NutritionType::getName).toList();
        roomTypes = hotel.getRoomTypes().stream().map(RoomType::getName).toList();
        stars = hotel.getStars();
    }
}

package com.example.kursach_server.dto.hotel;

import com.example.kursach_server.dto.resort.ResortLookupDTO;
import com.example.kursach_server.models.Hotel;
import com.example.kursach_server.models.NutritionType;
import com.example.kursach_server.models.RoomType;
import lombok.Getter;

import java.util.List;
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
    private final List<String> nutritionTypes;
    private final List<String> roomTypes;
    private final int stars;

    public HotelResponseDTO(Hotel hotel) {
        id = hotel.getId();
        hotelTitle = hotel.getHotelTitle();
        resort = new ResortLookupDTO(hotel.getResort());
        address = hotel.getAddress();
        hotelDescr = hotel.getHotelDescr();
        hotelNotes = hotel.getHotelNotes();
        photos = hotel.getPhotos();
        nutritionTypes = hotel.getNutritionTypes().stream().map(NutritionType::getName).toList();
        roomTypes = hotel.getRoomTypes().stream().map(RoomType::getName).toList();
        stars = hotel.getStars();
    }
}

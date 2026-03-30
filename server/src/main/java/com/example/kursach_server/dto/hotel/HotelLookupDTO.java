package com.example.kursach_server.dto.hotel;

import com.example.kursach_server.models.Hotel;
import lombok.Getter;

import java.util.UUID;

@Getter
public class HotelLookupDTO {
    private final UUID id;
    private final String hotelTitle;

    public HotelLookupDTO(Hotel hotel) {
        id = hotel.getId();
        hotelTitle = hotel.getHotelTitle();
    }
}

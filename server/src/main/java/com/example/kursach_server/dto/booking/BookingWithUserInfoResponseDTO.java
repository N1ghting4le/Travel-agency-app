package com.example.kursach_server.dto.booking;

import com.example.kursach_server.dto.user.UserResponseDTO;
import com.example.kursach_server.models.Booking;
import lombok.Getter;

@Getter
public class BookingWithUserInfoResponseDTO {
    private BookingResponseDTO booking;
    private UserResponseDTO userInfo;

    public BookingWithUserInfoResponseDTO(Booking booking) {
        this.booking = new BookingResponseDTO(booking);
        this.userInfo = new UserResponseDTO(booking.getUser());
    }
}

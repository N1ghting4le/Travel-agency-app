package com.example.kursach_server.dto.booking;

import com.example.kursach_server.dto.user.UserDTO;
import com.example.kursach_server.models.Booking;
import lombok.Getter;

@Getter
public class BookingWithUserInfoDTO {
    private BookingDTO booking;
    private UserDTO userInfo;
    public BookingWithUserInfoDTO(Booking booking) {
        this.booking = new BookingDTO(booking);
        userInfo = new UserDTO(booking.getUser());
    }
}

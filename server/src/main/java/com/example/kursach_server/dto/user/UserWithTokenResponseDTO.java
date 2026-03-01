package com.example.kursach_server.dto.user;

import com.example.kursach_server.models.User;
import lombok.Getter;

@Getter
public class UserWithTokenResponseDTO {
    private final String token;
    private final UserResponseDTO user;

    public UserWithTokenResponseDTO(String token, User user) {
        this.token = token;
        this.user = new UserResponseDTO(user);
    }

    public UserWithTokenResponseDTO(String token) {
        this.token = token;
        this.user = new UserResponseDTO();
    }
}

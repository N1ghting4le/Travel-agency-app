package com.example.kursach_server.dto.user;

import com.example.kursach_server.models.User;
import lombok.Getter;

@Getter
public class UserWithTokenResponseDTO {
    private final String token;
    private final UserResponseDTO user;
    private final boolean isNewUser;

    public UserWithTokenResponseDTO(String token, User user, boolean isNewUser) {
        this.token = token;
        this.user = new UserResponseDTO(user);
        this.isNewUser = isNewUser;
    }

    public UserWithTokenResponseDTO(String token, User user) {
        this.token = token;
        this.user = new UserResponseDTO(user);
        isNewUser = false;
    }

    public UserWithTokenResponseDTO(String token) {
        this.token = token;
        this.user = new UserResponseDTO();
        isNewUser = false;
    }
}

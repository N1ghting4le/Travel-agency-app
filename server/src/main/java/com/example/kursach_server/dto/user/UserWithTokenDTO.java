package com.example.kursach_server.dto.user;

import com.example.kursach_server.models.User;
import lombok.Getter;

@Getter
public class UserWithTokenDTO {
    private String token;
    private UserDTO user;
    public UserWithTokenDTO(String token, User user) {
        this.token = token;
        this.user = new UserDTO(user);
    }
    public UserWithTokenDTO(String token) {
        this.token = token;
        this.user = new UserDTO();
    }
}

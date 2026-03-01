package com.example.kursach_server.dto.user;

import com.example.kursach_server.models.User;
import lombok.Getter;

import java.util.UUID;

@Getter
public class UserResponseDTO {
    private UUID id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private String role;
    private final boolean isAdmin;

    public UserResponseDTO(User user) {
        id = user.getId();
        name = user.getName();
        surname = user.getSurname();
        email = user.getEmail();
        phoneNumber = user.getPhoneNumber();
        role = user.getRole();
        isAdmin = false;
    }

    public UserResponseDTO() {
        isAdmin = true;
    }
}

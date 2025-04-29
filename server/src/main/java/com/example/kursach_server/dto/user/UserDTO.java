package com.example.kursach_server.dto.user;

import com.example.kursach_server.models.User;
import lombok.Getter;

import java.util.UUID;

@Getter
public class UserDTO {
    private UUID id;
    private String name;
    private String surname;
    private String email;
    private String phoneNumber;
    private String role;
    private boolean isAdmin;
    public UserDTO(User user) {
        id = user.getId();
        name = user.getName();
        surname = user.getSurname();
        email = user.getEmail();
        phoneNumber = user.getPhoneNumber();
        role = user.getRole();
        isAdmin = false;
    }
    public UserDTO() {
        isAdmin = true;
    }
}

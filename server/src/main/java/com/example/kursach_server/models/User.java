package com.example.kursach_server.models;

import static jakarta.persistence.GenerationType.UUID;

import com.example.kursach_server.dto.user.CreateUserDTO;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Entity
@Table(name = "users")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {
    @Id
    @GeneratedValue(strategy = UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(unique = true, nullable = false, columnDefinition = "text")
    private String email;

    @Column(nullable = false, columnDefinition = "text")
    private String password;

    @Column(nullable = false, columnDefinition = "text")
    private String name;

    @Column(nullable = false, columnDefinition = "text")
    private String surname;

    @Column(unique = true, nullable = false, columnDefinition = "text")
    private String phoneNumber;

    @Column(nullable = false, columnDefinition = "text")
    private String role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Booking> takenBookings = new ArrayList<>();
    public User() {}
    public User(CreateUserDTO createUserDTO, String userRole) {
        email = createUserDTO.getEmail();
        password = createUserDTO.getPassword();
        name = createUserDTO.getName();
        surname = createUserDTO.getSurname();
        phoneNumber = createUserDTO.getPhoneNumber();
        role = userRole;
    }
}

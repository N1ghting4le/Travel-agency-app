package com.example.kursach_server.dto.hotel;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CreateHotelDTO {
    @NotNull
    @NotBlank
    private String title;

    @NotNull
    @NotBlank
    private String country;

    @NotNull
    @NotBlank
    private String resort;

    @NotNull
    @NotBlank
    private String address;

    @NotNull
    @NotEmpty
    private List<String> nutritionTypes;

    @NotNull
    @NotEmpty
    private List<String> roomTypes;

    @NotNull
    @Min(1)
    @Max(5)
    private int stars;

    @NotNull
    @Size(min = 5)
    private MultipartFile[] photos;

    @NotNull
    @NotBlank
    private String descr;

    private String notes;
}

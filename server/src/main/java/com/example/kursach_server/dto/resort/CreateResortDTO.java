package com.example.kursach_server.dto.resort;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateResortDTO {
    @NotNull
    @NotBlank
    private String country;

    @NotNull
    @NotBlank
    private String resort;
}

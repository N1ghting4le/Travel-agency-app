package com.example.kursach_server.controllers;

import com.example.kursach_server.constants.Roles;
import com.example.kursach_server.dto.hotel.CreateHotelDTO;
import com.example.kursach_server.dto.hotel.HotelPreviewDTO;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.service.HotelService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/hotel")
public class HotelController {
    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @PostMapping("/create")
    @RolesAllowed(Roles.ADMIN)
    public UUID createHotel(@Valid @ModelAttribute CreateHotelDTO hotelDTO)
        throws IOException, EntityNotFoundException, EntityAlreadyExistsException {
        return hotelService.createHotel(hotelDTO);
    }

    @GetMapping("/getHotels/{country}")
    public List<HotelPreviewDTO> getHotelsByCountry(@PathVariable @NotNull @NotBlank String country) {
        return hotelService.getHotelsByCountry(country);
    }
}

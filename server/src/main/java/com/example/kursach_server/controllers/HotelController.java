package com.example.kursach_server.controllers;

import com.example.kursach_server.dto.hotel.CreateHotelDTO;
import com.example.kursach_server.dto.hotel.HotelPreviewDTO;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.service.HotelService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/hotel")
public class HotelController {
    @Autowired
    private HotelService hotelService;
    @PostMapping("/create")
    @RolesAllowed("ADMIN")
    public ResponseEntity<?> addHotel(@Valid @ModelAttribute CreateHotelDTO hotelDTO)
            throws IOException, EntityNotFoundException, EntityAlreadyExistsException {
        hotelService.createHotel(hotelDTO);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/getHotels/{country}")
    public List<HotelPreviewDTO> getHotelsByCountry(@PathVariable @NotNull @NotBlank String country) {
        return hotelService.getHotelsByCountry(country);
    }
}

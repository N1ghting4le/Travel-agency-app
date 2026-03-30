package com.example.kursach_server.controllers;

import com.example.kursach_server.constants.Roles;
import com.example.kursach_server.dto.hotel.CreateHotelDTO;
import com.example.kursach_server.dto.hotel.HotelLookupDTO;
import com.example.kursach_server.dto.hotel.HotelResponseDTO;
import com.example.kursach_server.dto.hotel.HotelTableDTO;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.notFound.NotFoundException;
import com.example.kursach_server.service.HotelService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
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

    @GetMapping("/{id}")
    public HotelResponseDTO getHotelById(@PathVariable @NotNull UUID id) throws EntityNotFoundException {
        return hotelService.getHotelById(id);
    }

    @PatchMapping("/{id}")
    @RolesAllowed(Roles.ADMIN)
    public HotelResponseDTO updateHotel(
        @PathVariable @NotNull UUID id,
        @Valid @ModelAttribute CreateHotelDTO hotelDTO
    ) throws IOException, EntityNotFoundException {
        return hotelService.updateHotel(id, hotelDTO);
    }

    @GetMapping("/get/{country}")
    public List<HotelLookupDTO> getHotelsByCountry(@PathVariable @NotNull @NotBlank String country) {
        return hotelService.getHotelsByCountry(country);
    }

    @GetMapping("/get")
    public List<HotelLookupDTO> getHotelsByParams(
        @RequestParam @NotNull @NotBlank String country,
        @RequestParam(required = false) List<String> resorts,
        @RequestParam(required = false) List<String> nutrition,
        @RequestParam(required = false) List<String> rooms,
        @RequestParam int stars
    ) {
        return hotelService.getHotelsByParams(
            country, resorts, nutrition, rooms, stars
        );
    }

    @GetMapping("/get/admin")
    @RolesAllowed(Roles.ADMIN)
    public Page<HotelTableDTO> getHotelsForAdminTable(
        @Valid @RequestParam @NotNull String hotelTitle,
        @RequestParam int page,
        @RequestParam int pageSize
    ) {
        return hotelService.getHotelsForAdminTable(hotelTitle, page, pageSize);
    }

    @DeleteMapping("/delete/{id}")
    @RolesAllowed(Roles.ADMIN)
    public void deleteHotel(@Valid @PathVariable @NotNull UUID id) throws NotFoundException {
        hotelService.deleteHotel(id);
    }
}

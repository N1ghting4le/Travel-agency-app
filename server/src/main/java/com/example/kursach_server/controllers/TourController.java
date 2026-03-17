package com.example.kursach_server.controllers;

import com.example.kursach_server.constants.Roles;
import com.example.kursach_server.dto.PageDto;
import com.example.kursach_server.dto.booking.TourStatsDTO;
import com.example.kursach_server.dto.tour.CreateTourDTO;
import com.example.kursach_server.dto.tour.TourResponseDTO;
import com.example.kursach_server.dto.tour.TourPreviewDTO;
import com.example.kursach_server.dto.tour.UpdateTourDTO;
import com.example.kursach_server.exceptions.notFound.NotFoundException;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import com.example.kursach_server.requests.TourParamsRequest;
import com.example.kursach_server.service.TourService;

import java.util.UUID;

@RestController
@RequestMapping("/tour")
public class TourController {
    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @PostMapping("/getTours")
    public PageDto<TourPreviewDTO> getToursByParams(
        @Valid @RequestBody TourParamsRequest request,
        @RequestParam int page,
        @RequestParam int pageSize
    ) {
        return tourService.getToursByParams(request, page, pageSize);
    }

    @PostMapping("/create")
    @RolesAllowed(Roles.ADMIN)
    public UUID createTour(@Valid @RequestBody CreateTourDTO createTourDTO) throws NotFoundException {
        return tourService.createTour(createTourDTO);
    }

    @PatchMapping("/update")
    @RolesAllowed(Roles.ADMIN)
    public UpdateTourDTO updateTour(@Valid @RequestBody UpdateTourDTO updateTourDTO) throws NotFoundException {
        return tourService.updateTour(updateTourDTO);
    }

    @DeleteMapping("/delete/{id}")
    @RolesAllowed(Roles.ADMIN)
    public void deleteTour(@Valid @PathVariable @NotNull UUID id) throws NotFoundException {
        tourService.markTourForRemoval(id);
    }

    @GetMapping("/get/{id}")
    public TourResponseDTO getTour(@Valid @PathVariable @NotNull UUID id) throws NotFoundException {
        return tourService.getTour(id);
    }

    @GetMapping("/stats")
    public Page<TourStatsDTO> getTourStats(
        @RequestParam(required = false) Integer year,
        @RequestParam(required = false) Integer month,
        @RequestParam(required = false) String country,
        @RequestParam int page,
        @RequestParam int pageSize
    ) {
        return tourService.getTourStats(year, month, country, page, pageSize);
    }
}

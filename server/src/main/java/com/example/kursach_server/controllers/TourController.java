package com.example.kursach_server.controllers;

import com.example.kursach_server.dto.tour.CreateTourDTO;
import com.example.kursach_server.dto.tour.TourDTO;
import com.example.kursach_server.dto.tour.TourPreviewDTO;
import com.example.kursach_server.dto.tour.UpdateTourDTO;
import com.example.kursach_server.exceptions.notFound.NotFoundException;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.kursach_server.requests.TourParamsRequest;
import com.example.kursach_server.service.TourService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tour")
public class TourController {
    @Autowired
    private TourService tourService;
    @PostMapping("/getTours")
    public List<TourPreviewDTO> getToursByParams(@Valid @RequestBody TourParamsRequest request) {
        return tourService.getToursByParams(request);
    }
    @PostMapping("/create")
    @RolesAllowed("ADMIN")
    public ResponseEntity<?> createTour(@Valid @RequestBody CreateTourDTO createTourDTO) throws NotFoundException {
        tourService.createTour(createTourDTO);
        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/update")
    @RolesAllowed("ADMIN")
    public UpdateTourDTO updateTour(@Valid @RequestBody UpdateTourDTO updateTourDTO) throws NotFoundException {
        return tourService.updateTour(updateTourDTO);
    }
    @DeleteMapping("/delete/{id}")
    @RolesAllowed("ADMIN")
    public ResponseEntity<?> deleteTour(@Valid @PathVariable @NotNull UUID id) throws NotFoundException {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/get/{id}")
    public TourDTO getTour(@Valid @PathVariable @NotNull UUID id) throws NotFoundException {
        return tourService.getTour(id);
    }
    @DeleteMapping("/delete")
    @RolesAllowed("ADMIN")
    public ResponseEntity<?> deleteMarkedTours() {
        tourService.deleteMarkedTours();
        return ResponseEntity.noContent().build();
    }
}

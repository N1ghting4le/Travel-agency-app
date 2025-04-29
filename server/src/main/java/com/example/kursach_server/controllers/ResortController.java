package com.example.kursach_server.controllers;

import com.example.kursach_server.dto.resort.CreateResortDTO;
import com.example.kursach_server.dto.resort.ResortIdAndTitleDTO;
import com.example.kursach_server.exceptions.conflict.ResortAlreadyExistsException;
import com.example.kursach_server.service.ResortService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resort")
public class ResortController {
    @Autowired
    private ResortService resortService;
    @GetMapping("/get/{country}")
    public List<ResortIdAndTitleDTO> getResortsByCountry(@PathVariable @NotNull @NotBlank String country) {
        return resortService.getResortsByCountry(country);
    }
    @PostMapping("/create")
    @RolesAllowed("ADMIN")
    public ResponseEntity<?> createResort(@Valid @RequestBody CreateResortDTO createResortDTO)
            throws ResortAlreadyExistsException {
        resortService.createResort(createResortDTO);
        return ResponseEntity.noContent().build();
    }
}

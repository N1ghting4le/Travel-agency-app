package com.example.kursach_server.controllers;

import com.example.kursach_server.constants.Roles;
import com.example.kursach_server.dto.resort.CreateResortDTO;
import com.example.kursach_server.dto.resort.ResortLookupDTO;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.service.ResortService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/resort")
public class ResortController {
    private final ResortService resortService;

    public ResortController(ResortService resortService) {
        this.resortService = resortService;
    }

    @GetMapping("/get/{country}")
    public List<ResortLookupDTO> getResortsByCountry(@PathVariable @NotNull @NotBlank String country) {
        return resortService.getResortsByCountry(country);
    }

    @PostMapping("/create")
    @RolesAllowed(Roles.ADMIN)
    public UUID createResort(@Valid @RequestBody CreateResortDTO createResortDTO) throws EntityAlreadyExistsException {
        return resortService.createResort(createResortDTO);
    }
}

package com.example.kursach_server.service;

import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.models.Resort;
import com.example.kursach_server.dto.resort.CreateResortDTO;
import com.example.kursach_server.dto.resort.ResortLookupDTO;
import com.example.kursach_server.repository.ResortRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ResortService {
    private final ResortRepository resortRepository;

    public ResortService(ResortRepository resortRepository) {
        this.resortRepository = resortRepository;
    }

    public List<ResortLookupDTO> getResortsByCountry(String country) {
        return resortRepository.findByResortCountry(country).stream().map(ResortLookupDTO::new).toList();
    }

    public UUID createResort(CreateResortDTO createResortDTO) throws EntityAlreadyExistsException {
        Optional<Resort> resortInfo = resortRepository.findByResortTitleAndResortCountry(
            createResortDTO.getResort(),
            createResortDTO.getCountry()
        );

        if (resortInfo.isPresent()) {
            throw new EntityAlreadyExistsException("Курорт уже существует");
        }

        Resort resort = new Resort(createResortDTO);
        resortRepository.save(resort);

        return resort.getId();
    }
}

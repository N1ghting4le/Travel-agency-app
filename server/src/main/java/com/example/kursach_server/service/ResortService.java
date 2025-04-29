package com.example.kursach_server.service;

import com.example.kursach_server.exceptions.conflict.ResortAlreadyExistsException;
import com.example.kursach_server.models.Resort;
import com.example.kursach_server.dto.resort.CreateResortDTO;
import com.example.kursach_server.dto.resort.ResortIdAndTitleDTO;
import com.example.kursach_server.repository.ResortRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResortService {
    @Autowired
    private ResortRepository resortRepository;
    public List<ResortIdAndTitleDTO> getResortsByCountry(String country) {
        return resortRepository.findByResortCountry(country).stream().map(ResortIdAndTitleDTO::new).toList();
    }
    public void createResort(CreateResortDTO createResortDTO) throws ResortAlreadyExistsException {
        Optional<Resort> resortInfo = resortRepository.findByResortTitleAndResortCountry(
                createResortDTO.getResort(), createResortDTO.getCountry());

        if (resortInfo.isPresent()) {
            throw new ResortAlreadyExistsException("Курорт уже существует");
        }

        Resort resort = new Resort(createResortDTO);
        resortRepository.save(resort);
    }
}

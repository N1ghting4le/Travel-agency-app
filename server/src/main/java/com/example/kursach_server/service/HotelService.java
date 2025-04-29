package com.example.kursach_server.service;

import com.example.kursach_server.dto.hotel.CreateHotelDTO;
import com.example.kursach_server.dto.hotel.HotelPreviewDTO;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.models.Hotel;
import com.example.kursach_server.models.Resort;
import com.example.kursach_server.repository.HotelRepository;
import com.example.kursach_server.repository.ResortRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class HotelService {
    @Autowired
    private HotelRepository hotelRepository;
    @Autowired
    private ResortRepository resortRepository;
    @Value("${upload.dir}")
    private String uploadDir;
    public void createHotel(CreateHotelDTO hotelDTO)
            throws IOException, EntityNotFoundException, EntityAlreadyExistsException {
        Resort resort = resortRepository
                .findByResortTitleAndResortCountry(hotelDTO.getResort(), hotelDTO.getCountry())
                .orElseThrow(() -> new EntityNotFoundException("Курорт не найден"));

        if (resort.getHotels().stream().anyMatch(hotel -> Objects.equals(hotel.getHotelTitle(), hotelDTO.getTitle()))) {
            throw new EntityAlreadyExistsException("Отель уже существует");
        }

        String uploadPath = String.format(
                "%s/%s/%s/%s",
                uploadDir,
                resort.getResortCountry(),
                resort.getResortTitle(),
                hotelDTO.getTitle()
        );
        File uploadFolder = new File(uploadPath);

        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        List<String> photoNames = new ArrayList<>();

        for (MultipartFile photo : hotelDTO.getPhotos()) {
            if (!photo.isEmpty()) {
                String fileName = new Date().getTime() + "_" + photo.getOriginalFilename();
                Path filePath = Paths.get(uploadPath, fileName);

                Files.write(filePath, photo.getBytes());
                photoNames.add(fileName);
            }
        }

        Hotel hotel = new Hotel(hotelDTO, photoNames);
        hotel.setResort(resort);
        resort.getHotels().add(hotel);
        hotelRepository.save(hotel);
    }
    public List<HotelPreviewDTO> getHotelsByCountry(String country) {
        return hotelRepository.findByResortResortCountry(country).stream().map(HotelPreviewDTO::new).toList();
    }
}

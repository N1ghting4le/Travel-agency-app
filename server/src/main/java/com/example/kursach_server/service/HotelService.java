package com.example.kursach_server.service;

import com.example.kursach_server.dto.hotel.CreateHotelDTO;
import com.example.kursach_server.dto.hotel.HotelLookupDTO;
import com.example.kursach_server.dto.hotel.HotelResponseDTO;
import com.example.kursach_server.dto.hotel.HotelTableDTO;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.models.Hotel;
import com.example.kursach_server.models.Resort;
import com.example.kursach_server.repository.HotelRepository;
import com.example.kursach_server.repository.ResortRepository;
import com.example.kursach_server.utils.Utils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class HotelService {
    private final HotelRepository hotelRepository;
    private final ResortRepository resortRepository;
    private final String uploadDir;

    public HotelService(
        HotelRepository hotelRepository,
        ResortRepository resortRepository,
        @Value("${upload.dir}") String uploadDir
    ) {
        this.hotelRepository = hotelRepository;
        this.resortRepository = resortRepository;
        this.uploadDir = uploadDir;
    }

    public UUID createHotel(CreateHotelDTO hotelDTO)
        throws IOException, EntityNotFoundException, EntityAlreadyExistsException {
        Resort resort = resortRepository.findById(hotelDTO.getResortId())
            .orElseThrow(() -> new EntityNotFoundException("Курорт не найден"));

        if (hotelRepository.existsByResortIdAndHotelTitle(hotelDTO.getResortId(), hotelDTO.getTitle())) {
            throw new EntityAlreadyExistsException("Отель уже существует");
        }

        String uploadPath = String.format(
            "%s/%s/%s/%s",
            uploadDir,
            resort.getResortCountry(),
            resort.getResortTitle(),
            hotelDTO.getTitle()
        );
        List<String> photoNames = saveHotelPhotos(hotelDTO, uploadPath);

        Hotel hotel = new Hotel(hotelDTO, photoNames);
        hotel.setResort(resort);
        resort.getHotels().add(hotel);
        hotelRepository.save(hotel);

        return hotel.getId();
    }

    public HotelResponseDTO getHotelById(UUID id) throws EntityNotFoundException {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Отель не найден"));
        return new HotelResponseDTO(hotel);
    }

    public HotelResponseDTO updateHotel(UUID id, CreateHotelDTO hotelDTO)
        throws EntityNotFoundException, IOException {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Отель не найден"));

        deleteHotelDirectory(
            hotel.getResort().getResortCountry(),
            hotel.getResort().getResortTitle(),
            hotel.getHotelTitle()
        );

        String uploadPath = String.format(
            "%s/%s/%s/%s",
            uploadDir,
            hotel.getResort().getResortCountry(),
            hotel.getResort().getResortTitle(),
            hotelDTO.getTitle()
        );
        List<String> photoNames = saveHotelPhotos(hotelDTO, uploadPath);

        hotel.setHotelTitle(hotelDTO.getTitle());
        hotel.setAddress(hotelDTO.getAddress());
        hotel.setNutritionTypes(hotelDTO.getNutritionTypes().toArray(new String[0]));
        hotel.setRoomTypes(hotelDTO.getRoomTypes().toArray(new String[0]));
        hotel.setStars(hotelDTO.getStars());
        hotel.setPhotos(photoNames.toArray(new String[0]));
        hotel.setHotelDescr(hotelDTO.getDescr());
        hotel.setHotelNotes(hotelDTO.getNotes());

        hotelRepository.save(hotel);
        return new HotelResponseDTO(hotel);
    }

    public List<HotelLookupDTO> getHotelsByCountry(String country) {
        return hotelRepository.findByResortResortCountry(country).stream().map(HotelLookupDTO::new).toList();
    }

    public List<HotelLookupDTO> getHotelsByParams(
        String country,
        List<String> resortTitles,
        List<String> nutritionTypes,
        List<String> roomTypes,
        int stars
    ) {
        List<Hotel> hotels = hotelRepository.findByResortResortCountryAndStarsGreaterThanEqual(country, stars);

        return hotels.stream().filter(hotel -> (
            Utils.emptyOrContains(resortTitles, hotel.getResort().getResortTitle()) &&
            Utils.listAndArrayEmptyOrIntersect(nutritionTypes, hotel.getNutritionTypes()) &&
            Utils.listAndArrayEmptyOrIntersect(roomTypes, hotel.getRoomTypes())
        )).map(HotelLookupDTO::new).toList();
    }

    public Page<HotelTableDTO> getHotelsForAdminTable(
        String hotelTitle, int page, int pageSize
    ) {
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("hotelTitle").ascending());
        return hotelRepository.findByCriteria(hotelTitle, pageable).map(HotelTableDTO::new);
    }

    public void deleteHotel(UUID id) throws EntityNotFoundException {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Отель не найден"));

        deleteHotelDirectory(
            hotel.getResort().getResortCountry(),
            hotel.getResort().getResortTitle(),
            hotel.getHotelTitle()
        );

        hotelRepository.delete(hotel);
    }

    private void deleteHotelDirectory(String country, String resortTitle, String hotelTitle) {
        String uploadPath = String.format(
            "%s/%s/%s/%s",
            uploadDir,
            country,
            resortTitle,
            hotelTitle
        );
        File uploadFolder = new File(uploadPath);
        Utils.deleteDirectory(uploadFolder);
    }

    private List<String> saveHotelPhotos(CreateHotelDTO hotelDTO, String uploadPath) throws IOException {
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

        return photoNames;
    }
}

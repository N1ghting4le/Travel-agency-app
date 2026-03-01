package com.example.kursach_server.service;

import com.example.kursach_server.dto.booking.TourStatsDTO;
import com.example.kursach_server.dto.tour.CreateTourDTO;
import com.example.kursach_server.dto.tour.TourResponseDTO;
import com.example.kursach_server.dto.tour.TourPreviewDTO;
import com.example.kursach_server.dto.tour.UpdateTourDTO;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.models.Hotel;
import com.example.kursach_server.models.Tour;
import com.example.kursach_server.repository.HotelRepository;
import com.example.kursach_server.requests.TourParamsRequest;
import com.example.kursach_server.utils.Utils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.kursach_server.repository.TourRepository;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TourService {
    private final TourRepository tourRepository;
    private final HotelRepository hotelRepository;

    public TourService(TourRepository tourRepository, HotelRepository hotelRepository) {
        this.tourRepository = tourRepository;
        this.hotelRepository = hotelRepository;
    }

    public List<TourPreviewDTO> getToursByParams(TourParamsRequest request) {
        String departureCity = request.getDepartureCity();
        String destinationCountry = request.getDestinationCountry();
        List<String> nutrition = request.getNutrition();
        List<String> rooms = request.getRooms();
        List<String> resortTitles = request.getResorts();
        List<String> hotelTitles = request.getHotels();
        List<Tour> tours = tourRepository.findByCriteria(departureCity, destinationCountry, request.getStars());

        return tours.stream().filter(tour -> {
            Hotel hotel = tour.getHotel();

            return (
                (nutrition.isEmpty() || Arrays.stream(hotel.getNutritionTypes()).anyMatch(nutrition::contains)) &&
                (rooms.isEmpty() || Arrays.stream(hotel.getRoomTypes()).anyMatch(rooms::contains)) &&
                (hotelTitles.isEmpty() || hotelTitles.contains(hotel.getHotelTitle())) &&
                (resortTitles.isEmpty() || resortTitles.contains(hotel.getResort().getResortTitle()))
            );
        }).map(TourPreviewDTO::new).toList();
    }

    public UUID createTour(CreateTourDTO createTourDTO) throws EntityNotFoundException {
        Hotel hotel = hotelRepository.findById(createTourDTO.getHotelId())
            .orElseThrow(() -> new EntityNotFoundException("Отель не найден"));
        Tour tour = new Tour(createTourDTO);

        tour.setHotel(hotel);
        hotel.getTours().add(tour);
        tourRepository.save(tour);

        return tour.getId();
    }

    public UpdateTourDTO updateTour(UpdateTourDTO updateTourDTO) throws EntityNotFoundException {
        Tour tour = tourRepository.findById(updateTourDTO.getId())
            .orElseThrow(() -> new EntityNotFoundException("Тур не найден"));

        tour.setTourTitle(updateTourDTO.getTourTitle());
        tour.setTourDescr(updateTourDTO.getTourDescr());
        tour.setTourNotes(updateTourDTO.getTourNotes());
        tour.setBasePrice(updateTourDTO.getBasePrice());
        tourRepository.save(tour);

        return updateTourDTO;
    }

    public void markTourForRemoval(UUID id) throws EntityNotFoundException {
        Tour tour = tourRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Тур не найден"));

        tour.setDelete(true);
        tourRepository.save(tour);
    }

    public TourResponseDTO getTour(UUID id) throws EntityNotFoundException {
        Tour tour = tourRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Тур не найден"));

        return new TourResponseDTO(tour);
    }

    public Page<TourStatsDTO> getTourStats(Integer year, Integer month, String country, int page, int pageSize) {
        String normalizedCountry = Utils.normalizeCountry(country);

        if (page < 0) {
            page = 0;
        }
        if (pageSize <= 0) {
            pageSize = 10;
        }
        if (pageSize > 100) {
            pageSize = 100;
        }

        long offset = (long) page * pageSize;

        List<Object[]> results = tourRepository.findTourStats(year, month, normalizedCountry, pageSize, offset);
        long totalElements = tourRepository.countTourStats(year, month, normalizedCountry);

        List<TourStatsDTO> content = mapToTourStats(results);
        return new PageImpl<>(content, PageRequest.of(page, pageSize), totalElements);
    }

    private List<TourStatsDTO> mapToTourStats(List<Object[]> results) {
        return results.stream().map(result -> new TourStatsDTO(
            (UUID) result[0], // tour_id
            (String) result[1], // tour_title
            (String) result[2], // destination_country
            (String) result[3], // resort_title
            ((Number) result[4]).longValue(), // total_bookings
            ((Number) result[5]).doubleValue() // total_amount
        )).collect(Collectors.toList());
    }
}

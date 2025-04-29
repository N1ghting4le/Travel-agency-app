package com.example.kursach_server.service;

import com.example.kursach_server.dto.tour.CreateTourDTO;
import com.example.kursach_server.dto.tour.TourDTO;
import com.example.kursach_server.dto.tour.TourPreviewDTO;
import com.example.kursach_server.dto.tour.UpdateTourDTO;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.models.Hotel;
import com.example.kursach_server.models.Tour;
import com.example.kursach_server.repository.HotelRepository;
import com.example.kursach_server.requests.TourParamsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.kursach_server.repository.TourRepository;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class TourService {
    @Autowired
    private TourRepository tourRepository;
    @Autowired
    private HotelRepository hotelRepository;
    public List<TourPreviewDTO> getToursByParams(TourParamsRequest request) {
        String departureCity = request.getDepartureCity();
        String destinationCountry = request.getDestinationCountry();
        List<String> nutrition = request.getNutrition();
        List<String> rooms = request.getRooms();
        List<String> resortTitles = request.getResorts();
        List<String> hotelTitles = request.getHotels();
        List<Tour> tours = tourRepository
                .findByDepartureCityAndDestinationCountryAndHotelStarsGreaterThanEqualAndDeleteIsNull(
                        departureCity, destinationCountry, request.getStars());

        return tours.stream().filter(tour -> {
            Hotel hotel = tour.getHotel();

            return (nutrition.isEmpty() || Arrays.stream(hotel.getNutritionTypes()).anyMatch(nutrition::contains))
                    && (rooms.isEmpty() || Arrays.stream(hotel.getRoomTypes()).anyMatch(rooms::contains))
                    && (hotelTitles.isEmpty() || hotelTitles.contains(hotel.getHotelTitle()))
                    && (resortTitles.isEmpty() || resortTitles.contains(hotel.getResort().getResortTitle()));
        }).map(TourPreviewDTO::new).toList();
    }
    public void createTour(CreateTourDTO createTourDTO) throws EntityNotFoundException {
        Hotel hotel = hotelRepository.findById(createTourDTO.getHotelId())
                .orElseThrow(() -> new EntityNotFoundException("Отель не найден"));
        Tour tour = new Tour(createTourDTO);

        tour.setHotel(hotel);
        hotel.getTours().add(tour);
        tourRepository.save(tour);
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
    public void deleteTour(UUID id) throws EntityNotFoundException {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Тур не найден"));

        if (tour.getBookings().isEmpty()) {
            tourRepository.delete(tour);
        } else {
            tour.setDelete(true);
            tourRepository.save(tour);
        }
    }
    public TourDTO getTour(UUID id) throws EntityNotFoundException {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Тур не найден"));

        return new TourDTO(tour);
    }
    public void deleteMarkedTours() {
        tourRepository.findByDeleteIsTrue().forEach(t -> {
            if (t.getBookings().isEmpty()) {
                tourRepository.delete(t);
            }
        });
    }
}

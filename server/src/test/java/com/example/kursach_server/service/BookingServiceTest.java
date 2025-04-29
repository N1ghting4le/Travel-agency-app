package com.example.kursach_server.service;

import com.example.kursach_server.dto.booking.BookingDTO;
import com.example.kursach_server.dto.booking.BookingWithUserInfoDTO;
import com.example.kursach_server.dto.booking.CreateBookingDTO;
import com.example.kursach_server.exceptions.conflict.BookingIntersectionException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.conflict.UnavailableTourException;
import com.example.kursach_server.models.*;
import com.example.kursach_server.repository.*;
import com.example.kursach_server.requests.DateRangeRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Testcontainers
@ActiveProfiles("test")
@SpringBootTest
@Transactional
public class BookingServiceTest {

    @Container
    public static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @DynamicPropertySource
    static void postgresqlProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
    }

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResortRepository resortRepository;

    @Autowired
    private HotelRepository hotelRepository;

    private User testUser;
    private User testEmployee;
    private Resort testResort;
    private Hotel testHotel;
    private Tour testTour;
    private Booking testBooking;

    @BeforeEach
    void setUp() {
        // Очистка данных
        bookingRepository.deleteAll();
        tourRepository.deleteAll();
        userRepository.deleteAll();

        // Создание тестового пользователя
        testUser = new User();
        testUser.setEmail("user@test.com");
        testUser.setName("Test User");
        testUser.setSurname("Testov");
        testUser.setPhoneNumber("+1234567890");
        testUser.setRole("USER");
        testUser.setPassword("password");
        userRepository.save(testUser);

        // Создание тестового сотрудника
        testEmployee = new User();
        testEmployee.setEmail("employee@test.com");
        testEmployee.setName("Employee");
        testEmployee.setSurname("Employeev");
        testEmployee.setPhoneNumber("+0987654321");
        testEmployee.setRole("EMPL");
        testEmployee.setPassword("password");
        userRepository.save(testEmployee);

        testResort = new Resort();
        testResort.setResortCountry("United States");
        testResort.setResortTitle("Miami");
        resortRepository.save(testResort);

        testHotel = new Hotel();
        testHotel.setResort(testResort);
        testHotel.setHotelDescr("Hotel Description");
        testHotel.setHotelTitle("Hotel Title");
        testHotel.setAddress("Hotel Address");
        testHotel.setPhotos(new String[]{});
        testHotel.setStars(5);
        testHotel.setNutritionTypes(new String[]{});
        testHotel.setRoomTypes(new String[]{});
        hotelRepository.save(testHotel);

        // Создание тестового тура
        testTour = new Tour();
        testTour.setTourTitle("Test Tour");
        testTour.setTourDescr("Test Description");
        testTour.setBasePrice(1000);
        testTour.setDepartureCity("Minsk");
        testTour.setDestinationCountry("United States");
        testTour.setHotel(testHotel);
        tourRepository.save(testTour);

        // Создание тестовой брони
        testBooking = new Booking();
        testBooking.setUser(testUser);
        testBooking.setTour(testTour);
        testBooking.setStartDate(new Date(System.currentTimeMillis() + 86400000));
        testBooking.setEndDate(new Date(System.currentTimeMillis() + 172800000));
        testBooking.setStatus("Новая");
        testBooking.setBookingDate(new Date(System.currentTimeMillis()));
        testBooking.setNutritionType("AI");
        testBooking.setRoomType("DBL");
        testBooking.setAdultsAmount(2);
        testBooking.setChildrenAmount(0);
        bookingRepository.save(testBooking);
    }

    private HttpServletRequest mockRequestWithUser(String email) {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getAttribute("email")).thenReturn(email);
        return request;
    }

    @Test
    void createBooking_ShouldSuccessfullyCreateBooking() throws Exception {
        CreateBookingDTO dto = new CreateBookingDTO();
        dto.setTourId(testTour.getId());
        dto.setStartDate(new Date(System.currentTimeMillis() + 259200000));
        dto.setEndDate(new Date(System.currentTimeMillis() + 345600000));
        dto.setAdultsAmount(2);
        dto.setChildrenAmount(0);
        dto.setRoomType("DBL");
        dto.setNutrType("AI");

        bookingService.createBooking(dto, mockRequestWithUser(testUser.getEmail()));

        List<Booking> bookings = bookingRepository.findAll();
        assertEquals(2, bookings.size());
    }

    @Test
    void createBooking_ShouldThrowWhenTourNotFound() {
        CreateBookingDTO dto = new CreateBookingDTO();
        dto.setTourId(UUID.randomUUID());
        dto.setStartDate(new Date());
        dto.setEndDate(new Date());

        assertThrows(EntityNotFoundException.class, () ->
                bookingService.createBooking(dto, mockRequestWithUser(testUser.getEmail())));
    }

    @Test
    void createBooking_ShouldThrowWhenTourUnavailable() {
        testTour.setDelete(true);
        tourRepository.save(testTour);

        CreateBookingDTO dto = new CreateBookingDTO();
        dto.setTourId(testTour.getId());
        dto.setStartDate(new Date());
        dto.setEndDate(new Date());

        assertThrows(UnavailableTourException.class, () ->
                bookingService.createBooking(dto, mockRequestWithUser(testUser.getEmail())));
    }

    @Test
    void createBooking_ShouldThrowWhenDatesIntersect() {
        CreateBookingDTO dto = new CreateBookingDTO();
        dto.setTourId(testTour.getId());
        dto.setStartDate(testBooking.getStartDate());
        dto.setEndDate(testBooking.getEndDate());

        assertThrows(BookingIntersectionException.class, () ->
                bookingService.createBooking(dto, mockRequestWithUser(testUser.getEmail())));
    }

    @Test
    void getUserBookings_ShouldReturnUserBookings() {
        List<BookingDTO> result = bookingService.getUserBookings(testUser.getId());

        assertEquals(1, result.size());
        assertEquals(testTour.getId(), result.get(0).getTourId());
    }

    @Test
    void getBookingsInDateRange_ShouldReturnBookings() {
        DateRangeRequest dateRange = new DateRangeRequest();
        dateRange.setStartDate(new Date(System.currentTimeMillis()));
        dateRange.setEndDate(new Date(System.currentTimeMillis() + 259200000)); // +3 дня

        List<BookingWithUserInfoDTO> result = bookingService.getBookingsInDateRange(dateRange);

        assertEquals(1, result.size());
        assertEquals(testUser.getId(), result.get(0).getUserInfo().getId());
    }

    @Test
    void takeBooking_ShouldAssignEmployee() throws Exception {
        bookingService.takeBooking(testBooking.getId(), mockRequestWithUser(testEmployee.getEmail()));

        Booking updated = bookingRepository.findById(testBooking.getId()).orElseThrow();
        assertEquals("Взято сотрудником", updated.getStatus());
        assertEquals(testEmployee.getId(), updated.getEmployee().getId());
    }

    @Test
    void takeBooking_ShouldThrowWhenBookingNotFound() {
        assertThrows(EntityNotFoundException.class, () ->
                bookingService.takeBooking(UUID.randomUUID(), mockRequestWithUser(testEmployee.getEmail())));
    }

    @Test
    void changeStatus_ShouldApproveBooking() throws Exception {
        bookingService.changeStatus(testBooking.getId(), "approve");

        Booking updated = bookingRepository.findById(testBooking.getId()).orElseThrow();
        assertEquals("Одобрено", updated.getStatus());
    }

    @Test
    void changeStatus_ShouldRejectBooking() throws Exception {
        bookingService.changeStatus(testBooking.getId(), "reject");

        Booking updated = bookingRepository.findById(testBooking.getId()).orElseThrow();
        assertEquals("Отклонено", updated.getStatus());
    }

    @Test
    void changeStatus_ShouldThrowWhenBookingNotFound() {
        assertThrows(EntityNotFoundException.class, () ->
                bookingService.changeStatus(UUID.randomUUID(), "approve"));
    }
}
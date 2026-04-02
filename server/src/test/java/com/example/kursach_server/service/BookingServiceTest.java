package com.example.kursach_server.service;

import com.example.kursach_server.constants.BookingStatuses;
import com.example.kursach_server.constants.Roles;
import com.example.kursach_server.constants.Time;
import com.example.kursach_server.dto.booking.BookingResponseDTO;
import com.example.kursach_server.dto.booking.BookingWithUserInfoResponseDTO;
import com.example.kursach_server.dto.booking.CreateBookingDTO;
import com.example.kursach_server.exceptions.conflict.BookingAlreadyTakenException;
import com.example.kursach_server.exceptions.conflict.BookingIntersectionException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.conflict.UnavailableTourException;
import com.example.kursach_server.models.*;
import com.example.kursach_server.repository.*;
import com.example.kursach_server.requests.BookingsRequest;
import com.example.kursach_server.utils.Utils;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
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
    @SuppressWarnings("resource")
    public static PostgreSQLContainer<?> postgreSQLContainer =
        new PostgreSQLContainer<>("postgres:16-alpine")
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
    private Tour testTour;
    private Booking testBooking;

    @BeforeEach
    void setUp() {
        bookingRepository.deleteAll();
        tourRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User();
        testUser.setEmail("user@test.com");
        testUser.setName("Test User");
        testUser.setSurname("Testov");
        testUser.setPhoneNumber("+1234567890");
        testUser.setRole(Roles.USER);
        testUser.setPassword("password");
        userRepository.save(testUser);

        testEmployee = new User();
        testEmployee.setEmail("employee@test.com");
        testEmployee.setName("Employee");
        testEmployee.setSurname("Employeev");
        testEmployee.setPhoneNumber("+0987654321");
        testEmployee.setRole(Roles.EMPLOYEE);
        testEmployee.setPassword("password");
        userRepository.save(testEmployee);

        Resort testResort = new Resort();
        testResort.setResortCountry("United States");
        testResort.setResortTitle("Miami");
        resortRepository.save(testResort);

        Hotel testHotel = new Hotel();
        testHotel.setResort(testResort);
        testHotel.setHotelDescr("Hotel Description");
        testHotel.setHotelTitle("Hotel Title");
        testHotel.setAddress("Hotel Address");
        testHotel.setPhotos(new String[]{});
        testHotel.setStars(5);
        testHotel.setNutritionTypes(new String[]{});
        testHotel.setRoomTypes(new String[]{});
        hotelRepository.save(testHotel);

        testTour = new Tour();
        testTour.setTourTitle("Test Tour");
        testTour.setTourDescr("Test Description");
        testTour.setBasePrice(1000);
        testTour.setDepartureCity("Minsk");
        testTour.setDestinationCountry("United States");
        testTour.setHotel(testHotel);
        testTour.setDelete(false);
        tourRepository.save(testTour);

        testBooking = new Booking();
        testBooking.setUser(testUser);
        testBooking.setTour(testTour);
        testBooking.setStartDate(new Date(System.currentTimeMillis() + Time.MS_IN_DAY));
        testBooking.setEndDate(new Date(System.currentTimeMillis() + Time.MS_IN_DAY * 2));
        testBooking.setStatus("Новая");
        testBooking.setBookingDate(new Date(System.currentTimeMillis()));
        testBooking.setNutritionType("AI");
        testBooking.setRoomType("DBL");
        testBooking.setAdultsAmount(2);
        testBooking.setChildrenAmount(0);
        testBooking.setStatus(BookingStatuses.UNDER_CONSIDERATION);
        bookingRepository.save(testBooking);
    }

    private HttpServletRequest mockRequestWithUser(String email) {
        HttpServletRequest request = mock(HttpServletRequest.class);
        // Мокаем как атрибут, так и Principal на случай реализации Utils.getUserEmail()
        when(request.getAttribute("email")).thenReturn(email);
        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn(email);
        when(request.getUserPrincipal()).thenReturn(principal);
        return request;
    }

    @Test
    void createBooking_ShouldSuccessfullyCreateBooking() throws Exception {
        CreateBookingDTO dto = new CreateBookingDTO();
        dto.setTourId(testTour.getId());
        dto.setStartDate(new Date(System.currentTimeMillis() + Time.MS_IN_DAY * 3));
        dto.setEndDate(new Date(System.currentTimeMillis() + Time.MS_IN_DAY * 4));
        dto.setAdultsAmount(2);
        dto.setChildrenAmount(0);
        dto.setRoomType("DBL");
        dto.setNutrType("AI");

        UUID newBookingId = bookingService.createBooking(dto, mockRequestWithUser(testUser.getEmail()));

        assertNotNull(newBookingId);
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
        List<BookingResponseDTO> result = bookingService.getUserBookings(testUser.getId());

        assertEquals(1, result.size());
        assertEquals(testTour.getId(), result.getFirst().getTourId());
    }

    @Test
    void getBookingsByParams_WithNullEmployeeId_ShouldReturnNewBookings() {
        BookingsRequest request = new BookingsRequest();
        request.setStartDate(new Date(System.currentTimeMillis() - Time.MS_IN_DAY));
        request.setEndDate(new Date(System.currentTimeMillis() + Time.MS_IN_DAY));
        request.setEmail("test");
        request.setPhoneNumber("123");

        Page<BookingWithUserInfoResponseDTO> result = bookingService.getBookingsByParams(request, 0, 10);

        assertNotNull(result);
        assertFalse(result.getContent().isEmpty());
        assertEquals(testUser.getId(), result.getContent().getFirst().getUserInfo().getId());
    }

    @Test
    void getBookingsByParams_WithEmployeeId_ShouldReturnTakenBookings() {
        // Назначаем сотрудника для бронирования
        testBooking.setEmployee(testEmployee);
        testBooking.setStatus(BookingStatuses.TAKEN);
        bookingRepository.save(testBooking);

        BookingsRequest request = new BookingsRequest();
        request.setStartDate(new Date(System.currentTimeMillis() - Time.MS_IN_DAY));
        request.setEndDate(new Date(System.currentTimeMillis() + Time.MS_IN_DAY));
        request.setEmail("test");
        request.setPhoneNumber("123");
        request.setEmployeeId(testEmployee.getId());

        Page<BookingWithUserInfoResponseDTO> result = bookingService.getBookingsByParams(request, 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testUser.getId(), result.getContent().getFirst().getUserInfo().getId());
    }

    @Test
    void takeBooking_ShouldAssignEmployee() throws Exception {
        bookingService.takeBooking(testBooking.getId(), mockRequestWithUser(testEmployee.getEmail()));

        Booking updated = bookingRepository.findById(testBooking.getId()).orElseThrow();
        assertEquals(BookingStatuses.TAKEN, updated.getStatus());
        assertEquals(testEmployee.getId(), updated.getEmployee().getId());
    }

    @Test
    void takeBooking_ShouldThrowWhenBookingNotFound() {
        assertThrows(EntityNotFoundException.class, () ->
                bookingService.takeBooking(UUID.randomUUID(), mockRequestWithUser(testEmployee.getEmail())));
    }

    @Test
    void takeBooking_ShouldThrowWhenAlreadyTaken() {
        testBooking.setEmployee(testEmployee);
        bookingRepository.save(testBooking);

        assertThrows(BookingAlreadyTakenException.class, () ->
                bookingService.takeBooking(testBooking.getId(), mockRequestWithUser(testEmployee.getEmail())));
    }

    @Test
    void changeStatus_ShouldApproveBooking() throws Exception {
        bookingService.changeStatus(testBooking.getId(), "approve");

        Booking updated = bookingRepository.findById(testBooking.getId()).orElseThrow();
        assertEquals(Utils.getBookingStatusByAction("approve"), updated.getStatus());
    }

    @Test
    void changeStatus_ShouldRejectBooking() throws Exception {
        bookingService.changeStatus(testBooking.getId(), "reject");

        Booking updated = bookingRepository.findById(testBooking.getId()).orElseThrow();
        assertEquals(Utils.getBookingStatusByAction("reject"), updated.getStatus());
    }

    @Test
    void changeStatus_ShouldThrowWhenBookingNotFound() {
        assertThrows(EntityNotFoundException.class, () ->
                bookingService.changeStatus(UUID.randomUUID(), "approve"));
    }

    @Test
    void deleteBookings_ShouldExecuteWithoutErrors() {
        // Проверяем, что планировщик успешно вызывает методы репозитория без ошибок
        assertDoesNotThrow(() -> bookingService.deleteBookings());
    }
}
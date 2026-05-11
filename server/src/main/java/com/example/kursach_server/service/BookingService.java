package com.example.kursach_server.service;

import com.example.kursach_server.constants.BookingStatuses;
import com.example.kursach_server.constants.Time;
import com.example.kursach_server.dto.booking.*;
import com.example.kursach_server.exceptions.conflict.BookingAlreadyTakenException;
import com.example.kursach_server.exceptions.conflict.BookingIntersectionException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.conflict.UnavailableTourException;
import com.example.kursach_server.models.*;
import com.example.kursach_server.repository.*;
import com.example.kursach_server.requests.BookingsRequest;
import com.example.kursach_server.utils.Utils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final NutritionTypeRepository nutritionTypeRepository;

    public BookingService(
        BookingRepository bookingRepository,
        TourRepository tourRepository,
        UserRepository userRepository,
        RoomTypeRepository roomTypeRepository,
        NutritionTypeRepository nutritionTypeRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.tourRepository = tourRepository;
        this.userRepository = userRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.nutritionTypeRepository = nutritionTypeRepository;
    }

    public UUID createBooking(CreateBookingDTO createBookingDTO, HttpServletRequest request)
        throws EntityNotFoundException, UnavailableTourException, BookingIntersectionException {
        String email = Utils.getUserEmail(request);
        Date startDate = createBookingDTO.getStartDate();
        Date endDate = createBookingDTO.getEndDate();

        Tour tour = tourRepository.findById(createBookingDTO.getTourId())
            .orElseThrow(() -> new EntityNotFoundException("Тур не найден"));

        if (tour.getDelete() != null && tour.getDelete()) {
            throw new UnavailableTourException("Тур больше не доступен");
        }

        Optional<Booking> booking = bookingRepository
            .findFirstByUserEmailAndStartDateLessThanEqualAndEndDateGreaterThanEqual(email, endDate, startDate);

        if (booking.isPresent()) {
            throw new BookingIntersectionException("У вас уже есть бронь на эти даты");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));
        RoomType rt = roomTypeRepository.findByName(createBookingDTO.getRoomType())
            .orElseThrow(() -> new EntityNotFoundException("Тип номера не найден"));
        NutritionType nt = nutritionTypeRepository.findByName(createBookingDTO.getNutrType())
            .orElseThrow(() -> new EntityNotFoundException("Тип питания не найден"));

        Booking newBooking = new Booking(createBookingDTO);

        newBooking.setTour(tour);
        newBooking.setUser(user);
        newBooking.setRoomType(rt);
        newBooking.setNutritionType(nt);
        user.getBookings().add(newBooking);
        tour.getBookings().add(newBooking);
        bookingRepository.save(newBooking);

        return newBooking.getId();
    }

    public List<BookingResponseDTO> getUserBookings(UUID userId) {
        return bookingRepository.findByUserIdOrderByBookingDateDesc(userId)
            .stream().map(BookingResponseDTO::new).toList();
    }

    public Page<BookingWithUserInfoResponseDTO> getBookingsByParams(
        BookingsRequest bookingsRequest, int page, int pageSize
    ) {
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("bookingDate").ascending());
        Page<Booking> bookings;

        if (bookingsRequest.getEmployeeId() == null) {
            bookings = bookingRepository.findNewBookingsByParams(
                bookingsRequest.getStartDate(),
                bookingsRequest.getEndDate(),
                bookingsRequest.getEmail(),
                bookingsRequest.getPhoneNumber(),
                pageable
            );
        } else {
            bookings = bookingRepository.findTakenByParams(
                new Date(),
                bookingsRequest.getStartDate(),
                bookingsRequest.getEndDate(),
                bookingsRequest.getEmail(),
                bookingsRequest.getPhoneNumber(),
                bookingsRequest.getEmployeeId(),
                pageable
            );
        }

        return bookings.map(BookingWithUserInfoResponseDTO::new);
    }

    public void takeBooking(UUID bookingId, HttpServletRequest request)
        throws EntityNotFoundException, BookingAlreadyTakenException {
        String email = Utils.getUserEmail(request);
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new EntityNotFoundException("Бронь не найдена"));

        if (booking.getEmployee() != null) {
            throw new BookingAlreadyTakenException("Бронирование уже взято сотрудником");
        }

        User employee = userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Сотрудник не найден"));

        booking.setEmployee(employee);
        booking.setStatus(BookingStatuses.TAKEN);
        employee.getTakenBookings().add(booking);
        bookingRepository.save(booking);
    }

    public void changeStatus(UUID bookingId, String action) throws EntityNotFoundException {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new EntityNotFoundException("Бронь не найдена"));

        booking.setStatus(Utils.getBookingStatusByAction(action));
        bookingRepository.save(booking);
    }

    @Scheduled(fixedRate = Time.MS_IN_DAY)
    @Transactional
    public void deleteBookings() {
        Date today = new Date();

        bookingRepository.rejectExpiredBookings(today);
        bookingRepository.startApprovedBookings(today);
        bookingRepository.completeStartedBookings(today);
    }

    public Object getBookingStats(Integer year, Integer month, String country) {
        if (year == null) {
            throw new IllegalArgumentException("Год обязателен");
        }

        String normalizedCountry = Utils.normalizeCountry(country);

        if (month == null) {
            List<Object[]> results = bookingRepository.findMonthlyStats(year, normalizedCountry);
            return mapToMonthlyStats(results, year);
        }

        if (month < 0 || month > 11) {
            throw new IllegalArgumentException("Месяц должен быть между 0 и 11");
        }

        List<Object[]> results = bookingRepository.findDailyStats(year, month, normalizedCountry);
        return mapToDailyStats(results, year, month);
    }

    public Object getBookingCounts(Integer year, Integer month, String country) {
        if (year == null) {
            throw new IllegalArgumentException("Год обязателен");
        }

        String normalizedCountry = Utils.normalizeCountry(country);

        if (month == null) {
            List<Object[]> results = bookingRepository.findMonthlyCounts(year, normalizedCountry);
            return mapToMonthlyCounts(results, year);
        }

        if (month < 0 || month > 11) {
            throw new IllegalArgumentException("Месяц должен быть между 0 и 11");
        }

        List<Object[]> results = bookingRepository.findDailyCounts(year, month, normalizedCountry);
        return mapToDailyCounts(results, year, month);
    }

    public SummaryStatsDTO getBookingSummary(Integer year, Integer month, String country) {
        if (year == null) {
            throw new IllegalArgumentException("Год обязателен");
        }

        String normalizedCountry = Utils.normalizeCountry(country);
        Object[][] result;

        if (month == null) {
            result = bookingRepository.findYearlySummary(year, normalizedCountry);
        } else {
            if (month < 0 || month > 11) {
                throw new IllegalArgumentException("Месяц должен быть между 0 и 11");
            }

            result = bookingRepository.findMonthlySummary(year, month, normalizedCountry);
        }

        return mapToSummaryStats(result, year, month, normalizedCountry);
    }

    private List<MonthlyStatsDTO> mapToMonthlyStats(List<Object[]> results, int year) {
        int resultsIndex = 0;
        List<MonthlyStatsDTO> monthlyStats = new ArrayList<>();

        for (int i = 0; i < 12; i++) {
            if (resultsIndex < results.size() && ((Number) results.get(resultsIndex)[0]).intValue() == i) {
                monthlyStats.add(
                    new MonthlyStatsDTO(i, ((Number) results.get(resultsIndex)[1]).doubleValue(), year)
                );
                resultsIndex++;
            } else {
                monthlyStats.add(new MonthlyStatsDTO(i, 0, year));
            }
        }

        return monthlyStats;
    }

    private List<DailyStatsDTO> mapToDailyStats(List<Object[]> results, int year, int month) {
        int resultsIndex = 0;
        int daysInMonth = LocalDate.of(year, month + 1, 1).lengthOfMonth();
        List<DailyStatsDTO> dailyStats = new ArrayList<>();

        for (int i = 1; i <= daysInMonth; i++) {
            if (resultsIndex < results.size() && ((Number) results.get(resultsIndex)[0]).intValue() == i) {
                dailyStats.add(
                    new DailyStatsDTO(i, month, year, ((Number) results.get(resultsIndex)[3]).doubleValue())
                );
                resultsIndex++;
            } else {
                dailyStats.add(new DailyStatsDTO(i, month, year, 0));
            }
        }

        return dailyStats;
    }

    private List<MonthlyCountDTO> mapToMonthlyCounts(List<Object[]> results, int year) {
        int resultsIndex = 0;
        List<MonthlyCountDTO> monthlyStats = new ArrayList<>();

        for (int i = 0; i < 12; i++) {
            if (resultsIndex < results.size() && ((Number) results.get(resultsIndex)[0]).intValue() == i) {
                monthlyStats.add(new MonthlyCountDTO(i, ((Number) results.get(resultsIndex)[1]).longValue(), year));
                resultsIndex++;
            } else {
                monthlyStats.add(new MonthlyCountDTO(i, 0, year));
            }
        }

        return monthlyStats;
    }

    private List<DailyCountDTO> mapToDailyCounts(List<Object[]> results, int year, int month) {
        int resultsIndex = 0;
        int daysInMonth = LocalDate.of(year, month + 1, 1).lengthOfMonth();
        List<DailyCountDTO> dailyStats = new ArrayList<>();

        for (int i = 1; i <= daysInMonth; i++) {
            if (resultsIndex < results.size() && ((Number) results.get(resultsIndex)[0]).intValue() == i) {
                dailyStats.add(
                    new DailyCountDTO(i, month, year, ((Number) results.get(resultsIndex)[3]).longValue())
                );
                resultsIndex++;
            } else {
                dailyStats.add(new DailyCountDTO(i, month, year, 0));
            }
        }

        return dailyStats;
    }

    private SummaryStatsDTO mapToSummaryStats(Object[][] result, Integer year, Integer month, String country) {
        long count = 0;
        double total = 0.0;

        if (result != null && result[0].length >= 2) {
            if (result[0][0] != null) {
                count = ((Number) result[0][0]).longValue();
            }
            if (result[0][1] != null) {
                total = ((Number) result[0][1]).doubleValue();
            }
        }

        return new SummaryStatsDTO(count, total, year, month, country);
    }
}

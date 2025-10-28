package com.example.kursach_server.service;

import com.example.kursach_server.dto.booking.*;
import com.example.kursach_server.exceptions.conflict.BookingIntersectionException;
import com.example.kursach_server.exceptions.notFound.EntityNotFoundException;
import com.example.kursach_server.exceptions.conflict.UnavailableTourException;
import com.example.kursach_server.models.Booking;
import com.example.kursach_server.models.Tour;
import com.example.kursach_server.models.User;
import com.example.kursach_server.repository.BookingRepository;
import com.example.kursach_server.repository.TourRepository;
import com.example.kursach_server.repository.UserRepository;
import com.example.kursach_server.requests.DateRangeRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private TourRepository tourRepository;
    @Autowired
    private UserRepository userRepository;
    public void createBooking(CreateBookingDTO createBookingDTO, HttpServletRequest request)
            throws EntityNotFoundException, UnavailableTourException, BookingIntersectionException {
        String email = (String) request.getAttribute("email");
        Date startDate = createBookingDTO.getStartDate();
        Date endDate = createBookingDTO.getEndDate();
        Tour tour = tourRepository.findById(createBookingDTO.getTourId())
                .orElseThrow(() -> new EntityNotFoundException("Тур не найден"));

        if (tour.getDelete() != null) {
            throw new UnavailableTourException("Тур больше не доступен");
        }

        Optional<Booking> booking = bookingRepository
                .findFirstByUserEmailAndStartDateLessThanEqualAndEndDateGreaterThanEqual(email, endDate, startDate);

        if (booking.isPresent()) {
            throw new BookingIntersectionException("У вас уже есть бронь на эти даты");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));
        Booking newBooking = new Booking(createBookingDTO);

        newBooking.setTour(tour);
        newBooking.setUser(user);
        user.getBookings().add(newBooking);
        tour.getBookings().add(newBooking);
        bookingRepository.save(newBooking);
    }
    public List<BookingDTO> getUserBookings(UUID userId) {
        return bookingRepository.findByUserId(userId).stream().map(BookingDTO::new).toList();
    }
    public List<BookingWithUserInfoDTO> getBookingsInDateRange(DateRangeRequest dateRange) {
        return bookingRepository
                .findByBookingDateBetweenAndEmployeeIsNullOrderByBookingDateAsc(
                        dateRange.getStartDate(), dateRange.getEndDate())
                .stream().map(BookingWithUserInfoDTO::new).toList();
    }
    public void takeBooking(UUID bookingId, HttpServletRequest request) throws EntityNotFoundException {
        String email = (String) request.getAttribute("email");
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Бронь не найдена"));
        User employee = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Сотрудник не найден"));

        booking.setEmployee(employee);
        booking.setStatus("Взято сотрудником");
        employee.getTakenBookings().add(booking);
        bookingRepository.save(booking);
    }
    public void changeStatus(UUID bookingId, String action) throws EntityNotFoundException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Бронь не найдена"));

        booking.setStatus(Objects.equals(action, "approve") ? "Одобрено" : "Отклонено");
        bookingRepository.save(booking);
    }
    public List<BookingWithUserInfoDTO> getBookingsTakenByEmployee(UUID employeeId) {
        return bookingRepository.findByEmployeeId(employeeId).stream().map(BookingWithUserInfoDTO::new).toList();
    }

    public Object getBookingStats(Integer year, Integer month, String country) {
        if (year == null) {
            throw new IllegalArgumentException("Year is required");
        }

        String normalizedCountry = normalizeCountry(country);

        if (month == null) {
            // Статистика по месяцам года
            List<Object[]> results = bookingRepository.findMonthlyStats(year, normalizedCountry);
            return mapToMonthlyStats(results, year);
        } else {
            // Статистика по дням месяца
            if (month < 0 || month > 11) {
                throw new IllegalArgumentException("Month must be between 0 and 11");
            }
            List<Object[]> results = bookingRepository.findDailyStats(year, month, normalizedCountry);
            return mapToDailyStats(results, year, month);
        }
    }

    public Object getBookingCounts(Integer year, Integer month, String country) {
        if (year == null) {
            throw new IllegalArgumentException("Year is required");
        }

        String normalizedCountry = normalizeCountry(country);

        if (month == null) {
            List<Object[]> results = bookingRepository.findMonthlyCounts(year, normalizedCountry);
            return mapToMonthlyCounts(results, year);
        } else {
            if (month < 0 || month > 11) {
                throw new IllegalArgumentException("Month must be between 0 and 11");
            }
            List<Object[]> results = bookingRepository.findDailyCounts(year, month, normalizedCountry);
            return mapToDailyCounts(results, year, month);
        }
    }

    public SummaryStatsDTO getBookingSummary(Integer year, Integer month, String country) {
        if (year == null) {
            throw new IllegalArgumentException("Year is required");
        }

        String normalizedCountry = normalizeCountry(country);

        Object[][] result;

        if (month == null) {
            // Статистика за год
            result = bookingRepository.findYearlySummary(year, normalizedCountry);
        } else {
            // Статистика за месяц
            if (month < 0 || month > 11) {
                throw new IllegalArgumentException("Month must be between 0 and 11");
            }
            result = bookingRepository.findMonthlySummary(year, month, normalizedCountry);
        }

        return mapToSummaryStats(result, year, month, normalizedCountry);
    }

    // Остальные методы маппинга остаются без изменений
    private List<MonthlyStatsDTO> mapToMonthlyStats(List<Object[]> results, int year) {
        int resultsIndex = 0;
        List<MonthlyStatsDTO> monthlyStats = new ArrayList<>();

        for (int i = 0; i < 12; i++) {
            if (resultsIndex < results.size() && ((Number) results.get(resultsIndex)[0]).intValue() == i) {
                monthlyStats.add(new MonthlyStatsDTO(
                        i, ((Number) results.get(resultsIndex)[1]).doubleValue(), year));
                resultsIndex++;
            } else {
                monthlyStats.add(new MonthlyStatsDTO(i, 0, year));
            }
        }

        return monthlyStats;
    }

    private List<DailyStatsDTO> mapToDailyStats(List<Object[]> results, int year, int month) {
        int resultsIndex = 0;
        List<DailyStatsDTO> dailyStats = new ArrayList<>();
        int daysInMonth = LocalDate.of(year, month + 1, 1).lengthOfMonth();

        for (int i = 1; i <= daysInMonth; i++) {
            if (resultsIndex < results.size() && ((Number) results.get(resultsIndex)[0]).intValue() == i) {
                dailyStats.add(new DailyStatsDTO(
                        i, month, year, ((Number) results.get(resultsIndex)[3]).doubleValue()));
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
                monthlyStats.add(new MonthlyCountDTO(
                        i, ((Number) results.get(resultsIndex)[1]).longValue(), year));
                resultsIndex++;
            } else {
                monthlyStats.add(new MonthlyCountDTO(i, 0, year));
            }
        }

        return monthlyStats;
    }

    private List<DailyCountDTO> mapToDailyCounts(List<Object[]> results, int year, int month) {
        int resultsIndex = 0;
        List<DailyCountDTO> dailyStats = new ArrayList<>();
        int daysInMonth = LocalDate.of(year, month + 1, 1).lengthOfMonth();

        for (int i = 1; i <= daysInMonth; i++) {
            if (resultsIndex < results.size() && ((Number) results.get(resultsIndex)[0]).intValue() == i) {
                dailyStats.add(new DailyCountDTO(
                        i, month, year, ((Number) results.get(resultsIndex)[3]).longValue()));
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

    public Page<TourStatsDTO> getTourStats(Integer year, Integer month, String country,
                                           int page, int pageSize) {
        String normalizedCountry = normalizeCountry(country);

        // Валидация параметров пагинации
        if (page < 0) {
            page = 0;
        }
        if (pageSize <= 0) {
            pageSize = 10; // значение по умолчанию
        }
        if (pageSize > 100) {
            pageSize = 100; // ограничение максимального размера страницы
        }

        long offset = (long) page * pageSize;

        // Получаем данные для текущей страницы
        List<Object[]> results = bookingRepository.findTourStats(
                year, month, normalizedCountry, pageSize, offset);

        // Получаем общее количество
        long totalElements = bookingRepository.countTourStats(year, month, normalizedCountry);

        // Маппим результаты
        List<TourStatsDTO> content = mapToTourStats(results);

        return new PageImpl<>(content, PageRequest.of(page, pageSize), totalElements);
    }

    private List<TourStatsDTO> mapToTourStats(List<Object[]> results) {
        return results.stream()
                .map(result -> new TourStatsDTO(
                        (UUID) result[0], // tour_id
                        (String) result[1], // tour_title
                        (String) result[2], // destination_country
                        (String) result[3], // resort_title
                        ((Number) result[4]).longValue(), // total_bookings
                        ((Number) result[5]).doubleValue() // total_amount
                ))
                .collect(Collectors.toList());
    }

    private String normalizeCountry(String country) {
        return (country == null || country.trim().isEmpty()) ? null : country.trim();
    }
}

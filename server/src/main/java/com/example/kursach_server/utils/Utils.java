package com.example.kursach_server.utils;

import com.example.kursach_server.constants.BookingStatuses;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Arrays;
import java.util.List;

public class Utils {
    public static String getUserEmail(HttpServletRequest request) {
        return (String) request.getAttribute("email");
    }

    public static String getBookingStatusByAction(String action) {
        return switch (action) {
            case "approve" -> BookingStatuses.APPROVED;
            case "reject" -> BookingStatuses.REJECTED;
            default -> null;
        };
    }

    public static String normalizeCountry(String country) {
        return (country == null || country.trim().isEmpty()) ? null : country.trim();
    }

    public static <T> boolean emptyOrContains(List<T> list, T item) {
        return list == null || list.isEmpty() || list.contains(item);
    }

    public static <T> boolean listAndArrayEmptyOrIntersect(List<T> list, T[] array) {
        return (
            list == null ||
            list.isEmpty() ||
            array == null ||
            array.length == 0 ||
            Arrays.stream(array).anyMatch(list::contains)
        );
    }
}

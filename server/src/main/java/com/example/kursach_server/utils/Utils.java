package com.example.kursach_server.utils;

import com.example.kursach_server.constants.BookingStatuses;
import jakarta.servlet.http.HttpServletRequest;

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
}

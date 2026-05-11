package com.example.kursach_server.utils;

import com.example.kursach_server.constants.BookingStatuses;
import jakarta.servlet.http.HttpServletRequest;

import java.io.File;
import java.util.Arrays;
import java.util.HashSet;
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

    public static <T> boolean twoListsEmptyOrIntersect(List<T> list1, List<T> list2) {
        if (list1 == null || list1.isEmpty() || list2 == null || list2.isEmpty()) {
            return true;
        }

        HashSet<T> set = new HashSet<>(list1);

        return list2.stream().anyMatch(set::contains);
    }

    public static void deleteDirectory(File file) {
        File[] contents = file.listFiles();
        if (contents != null) {
            for (File f : contents) {
                deleteDirectory(f);
            }
        }
        file.delete();
    }
}

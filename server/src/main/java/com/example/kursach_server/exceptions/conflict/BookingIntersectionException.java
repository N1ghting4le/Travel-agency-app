package com.example.kursach_server.exceptions.conflict;

public class BookingIntersectionException extends ConflictException {
    public BookingIntersectionException(String message) {
        super(message);
    }
}

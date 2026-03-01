package com.example.kursach_server.exceptions.conflict;

public class BookingAlreadyTakenException extends ConflictException {
    public BookingAlreadyTakenException(String message) {
        super(message);
    }
}

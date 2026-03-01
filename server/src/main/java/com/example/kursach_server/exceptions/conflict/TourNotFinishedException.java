package com.example.kursach_server.exceptions.conflict;

public class TourNotFinishedException extends ConflictException {
    public TourNotFinishedException(String message) {
        super(message);
    }
}

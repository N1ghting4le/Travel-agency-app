package com.example.kursach_server.exceptions.conflict;

public class UnavailableTourException extends ConflictException {
    public UnavailableTourException(String message) {
        super(message);
    }
}

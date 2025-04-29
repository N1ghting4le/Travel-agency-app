package com.example.kursach_server.exceptions.conflict;

public class ResortAlreadyExistsException extends ConflictException {
    public ResortAlreadyExistsException(String message) {
        super(message);
    }
}

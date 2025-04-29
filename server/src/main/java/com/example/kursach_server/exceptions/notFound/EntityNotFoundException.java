package com.example.kursach_server.exceptions.notFound;

public class EntityNotFoundException extends NotFoundException {
    public EntityNotFoundException(String message) {
        super(message);
    }
}

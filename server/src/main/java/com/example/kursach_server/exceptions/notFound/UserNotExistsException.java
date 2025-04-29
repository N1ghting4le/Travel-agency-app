package com.example.kursach_server.exceptions.notFound;

public class UserNotExistsException extends NotFoundException {
    public UserNotExistsException(String message) {
        super(message);
    }
}

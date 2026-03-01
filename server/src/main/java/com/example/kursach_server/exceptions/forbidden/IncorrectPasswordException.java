package com.example.kursach_server.exceptions.forbidden;

public class IncorrectPasswordException extends ForbiddenException {
    public IncorrectPasswordException(String message) {
        super(message);
    }
}

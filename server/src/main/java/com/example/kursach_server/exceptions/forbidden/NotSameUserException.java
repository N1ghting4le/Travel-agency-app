package com.example.kursach_server.exceptions.forbidden;

public class NotSameUserException extends ForbiddenException {
    public NotSameUserException(String message) {
        super(message);
    }
}

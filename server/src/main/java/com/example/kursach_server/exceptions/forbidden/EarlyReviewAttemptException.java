package com.example.kursach_server.exceptions.forbidden;

public class EarlyReviewAttemptException extends ForbiddenException {
    public EarlyReviewAttemptException(String message) {
        super(message);
    }
}

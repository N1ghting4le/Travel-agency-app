package com.example.kursach_server.exceptions.conflict;

public class EntityAlreadyExistsException extends ConflictException {
    public EntityAlreadyExistsException(String message) {
        super(message);
    }
}

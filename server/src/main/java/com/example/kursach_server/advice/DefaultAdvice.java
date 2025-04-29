package com.example.kursach_server.advice;

import com.example.kursach_server.exceptions.*;
import com.example.kursach_server.exceptions.conflict.ConflictException;
import com.example.kursach_server.exceptions.forbidden.ForbiddenException;
import com.example.kursach_server.exceptions.notFound.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;

@ControllerAdvice
public class DefaultAdvice {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        if (e instanceof ConflictException) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
        if (e instanceof NotFoundException) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        if (e instanceof IncorrectPasswordException) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
        if (e instanceof IOException) {
            return new ResponseEntity<>("Failed to save photo: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (e instanceof ForbiddenException) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}

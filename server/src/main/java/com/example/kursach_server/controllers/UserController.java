package com.example.kursach_server.controllers;

import com.example.kursach_server.dto.user.CreateUserDTO;
import com.example.kursach_server.requests.SignInRequest;
import com.example.kursach_server.dto.user.UserWithTokenResponseDTO;
import com.example.kursach_server.exceptions.forbidden.IncorrectPasswordException;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.exceptions.notFound.UserNotExistsException;
import com.example.kursach_server.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signUp")
    public UserWithTokenResponseDTO signUp(@Valid @RequestBody CreateUserDTO createUserDTO, HttpServletRequest request)
        throws EntityAlreadyExistsException {
        return userService.createUser(createUserDTO, request);
    }

    @PostMapping("/signIn")
    public UserWithTokenResponseDTO signIn(@Valid @RequestBody SignInRequest signInRequest)
        throws UserNotExistsException, IncorrectPasswordException {
        return userService.getUser(signInRequest);
    }

    @GetMapping("/auth")
    public UserWithTokenResponseDTO getUser(HttpServletRequest request) throws UserNotExistsException {
        return userService.authorize(request);
    }
}

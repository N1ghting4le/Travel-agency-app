package com.example.kursach_server.service;

import com.example.kursach_server.dto.user.CreateUserDTO;
import com.example.kursach_server.requests.SignInRequest;
import com.example.kursach_server.dto.user.UserWithTokenDTO;
import com.example.kursach_server.exceptions.IncorrectPasswordException;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.exceptions.notFound.UserNotExistsException;
import com.example.kursach_server.models.User;
import com.example.kursach_server.repository.UserRepository;
import com.example.kursach_server.jwt.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Value("${admin.email}")
    private String adminEmail;
    private PasswordEncoder passwordEncoder;
    private String adminPassword;

    public UserService(
            @Autowired PasswordEncoder passwordEncoder, @Value("${admin.password}") String adminPassword) {
        this.passwordEncoder = passwordEncoder;
        this.adminPassword = passwordEncoder.encode(adminPassword);
    }

    public boolean isAdminEmail(Object email) {
        return Objects.equals(email, adminEmail);
    }
    public UserWithTokenDTO createUser(CreateUserDTO createUserDTO, HttpServletRequest request)
            throws EntityAlreadyExistsException {
        String email = createUserDTO.getEmail();
        String role = isAdminEmail(request.getAttribute("email")) ? "EMPL" : "USER";

        if (isAdminEmail(email) || userRepository.existsByEmail(email)) {
            throw new EntityAlreadyExistsException("Пользователь с этим адресом эл. почты уже существует");
        }

        if (userRepository.existsByPhoneNumber(createUserDTO.getPhoneNumber())) {
            throw new EntityAlreadyExistsException("Пользователь с этим номером телефона уже существует");
        }

        createUserDTO.setPassword(passwordEncoder.encode(createUserDTO.getPassword()));

        User user = new User(createUserDTO, role);
        userRepository.save(user);

        return new UserWithTokenDTO(jwtTokenUtil.generateToken(email, "ROLE_" + role), user);
    }

    public UserWithTokenDTO getUser(SignInRequest signInRequest)
            throws UserNotExistsException, IncorrectPasswordException {
        String phoneOrEmail = signInRequest.getPhoneOrEmail();
        String password = signInRequest.getPassword();

        if (isAdminEmail(phoneOrEmail)) {
            if (!passwordEncoder.matches(password, adminPassword)) {
                throw new IncorrectPasswordException("Неверный пароль");
            }

            return new UserWithTokenDTO(jwtTokenUtil.generateToken(phoneOrEmail, "ROLE_ADMIN"));
        }

        User user = userRepository.findByPhoneNumberOrEmail(phoneOrEmail, phoneOrEmail)
                .orElseThrow(() -> new UserNotExistsException("Пользователя не существует"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IncorrectPasswordException("Неверный пароль");
        }

        removeOldBookings(user);

        return new UserWithTokenDTO(jwtTokenUtil.generateToken(user.getEmail(), "ROLE_" + user.getRole()), user);
    }

    public UserWithTokenDTO authorize(HttpServletRequest request) throws UserNotExistsException {
        String email = (String) request.getAttribute("email");

        if (isAdminEmail(email)) {
            return new UserWithTokenDTO(jwtTokenUtil.generateToken(email, "ROLE_ADMIN"));
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotExistsException("Пользователя не существует"));

        removeOldBookings(user);

        return new UserWithTokenDTO(jwtTokenUtil.generateToken(email, "ROLE_" + user.getRole()), user);
    }
    private void removeOldBookings(User user) {
        long now = new Date().getTime();

        user.getBookings().removeIf(b -> b.getEndDate().getTime() < now);
        userRepository.save(user);
    }
}

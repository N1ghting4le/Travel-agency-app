package com.example.kursach_server.service;

import com.example.kursach_server.constants.Roles;
import com.example.kursach_server.dto.user.CreateUserDTO;
import com.example.kursach_server.requests.SignInRequest;
import com.example.kursach_server.dto.user.UserWithTokenResponseDTO;
import com.example.kursach_server.exceptions.forbidden.IncorrectPasswordException;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.exceptions.notFound.UserNotExistsException;
import com.example.kursach_server.models.User;
import com.example.kursach_server.repository.UserRepository;
import com.example.kursach_server.jwt.JwtTokenUtil;
import com.example.kursach_server.utils.Utils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public UserService(
        UserRepository userRepository,
        JwtTokenUtil jwtTokenUtil,
        PasswordEncoder passwordEncoder,
        @Value("${admin.email}") String adminEmail,
        @Value("${admin.password}") String adminPassword
    ) {
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = passwordEncoder.encode(adminPassword);
    }

    public UserWithTokenResponseDTO createUser(CreateUserDTO createUserDTO, HttpServletRequest request)
        throws EntityAlreadyExistsException {
        String email = createUserDTO.getEmail();
        String role = isAdminEmail(Utils.getUserEmail(request)) ? Roles.EMPLOYEE : Roles.USER;

        if (isAdminEmail(email) || userRepository.existsByEmail(email)) {
            throw new EntityAlreadyExistsException("Пользователь с этим адресом эл. почты уже существует");
        }

        if (userRepository.existsByPhoneNumber(createUserDTO.getPhoneNumber())) {
            throw new EntityAlreadyExistsException("Пользователь с этим номером телефона уже существует");
        }

        createUserDTO.setPassword(passwordEncoder.encode(createUserDTO.getPassword()));

        User user = new User(createUserDTO, role);
        userRepository.save(user);

        return new UserWithTokenResponseDTO(jwtTokenUtil.generateToken(email, role), user);
    }

    public UserWithTokenResponseDTO getUser(SignInRequest signInRequest)
        throws UserNotExistsException, IncorrectPasswordException {
        String phoneOrEmail = signInRequest.getPhoneOrEmail();
        String password = signInRequest.getPassword();

        if (isAdminEmail(phoneOrEmail)) {
            if (!passwordEncoder.matches(password, adminPassword)) {
                throw new IncorrectPasswordException("Неверный пароль");
            }

            return new UserWithTokenResponseDTO(jwtTokenUtil.generateToken(phoneOrEmail, Roles.ADMIN));
        }

        User user = userRepository.findByPhoneNumberOrEmail(phoneOrEmail, phoneOrEmail)
            .orElseThrow(() -> new UserNotExistsException("Пользователя не существует"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IncorrectPasswordException("Неверный пароль");
        }

        return new UserWithTokenResponseDTO(jwtTokenUtil.generateToken(user.getEmail(), user.getRole()), user);
    }

    public UserWithTokenResponseDTO authorize(HttpServletRequest request) throws UserNotExistsException {
        String email = Utils.getUserEmail(request);

        if (isAdminEmail(email)) {
            return new UserWithTokenResponseDTO(jwtTokenUtil.generateToken(email, Roles.ADMIN));
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotExistsException("Пользователя не существует"));

        return new UserWithTokenResponseDTO(jwtTokenUtil.generateToken(email, user.getRole()), user);
    }

    private boolean isAdminEmail(Object email) {
        return Objects.equals(email, adminEmail);
    }
}

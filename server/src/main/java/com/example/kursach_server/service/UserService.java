package com.example.kursach_server.service;

import com.example.kursach_server.constants.Roles;
import com.example.kursach_server.dto.user.CompleteProfileDTO;
import com.example.kursach_server.dto.user.CreateUserDTO;
import com.example.kursach_server.dto.user.UserResponseDTO;
import com.example.kursach_server.exceptions.forbidden.ForbiddenException;
import com.example.kursach_server.requests.SignInRequest;
import com.example.kursach_server.dto.user.UserWithTokenResponseDTO;
import com.example.kursach_server.exceptions.forbidden.IncorrectPasswordException;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.exceptions.notFound.UserNotExistsException;
import com.example.kursach_server.models.User;
import com.example.kursach_server.repository.UserRepository;
import com.example.kursach_server.jwt.JwtTokenUtil;
import com.example.kursach_server.utils.Utils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Objects;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String GOOGLE_CLIENT_ID;

    public UserService(
        UserRepository userRepository,
        JwtTokenUtil jwtTokenUtil,
        PasswordEncoder passwordEncoder,
        @Value("${admin.email}") String adminEmail,
        @Value("${admin.password}") String adminPassword,
        @Value("${google.client.id}") String GOOGLE_CLIENT_ID
    ) {
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = passwordEncoder.encode(adminPassword);
        this.GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID;
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

    public UserWithTokenResponseDTO googleAuth(String idTokenString) throws ForbiddenException {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                User user = userRepository.findByEmail(email).orElse(null);

                if (user == null) {
                    user = new User();
                    user.setEmail(email);
                    user.setRole(Roles.USER);
                }

                String token = jwtTokenUtil.generateToken(user.getEmail(), user.getRole());

                return new UserWithTokenResponseDTO(token, user);
            } else {
                throw new ForbiddenException("Недействительный Google токен.");
            }
        } catch (Exception e) {
            throw new ForbiddenException("Ошибка авторизации через Google: " + e.getMessage());
        }
    }

    public UserResponseDTO completeProfile(CompleteProfileDTO completeProfileDTO, HttpServletRequest request)
        throws EntityAlreadyExistsException {
        if (userRepository.existsByPhoneNumber(completeProfileDTO.getPhoneNumber())) {
            throw new EntityAlreadyExistsException("Пользователь с этим номером телефона уже существует");
        }

        String email = Utils.getUserEmail(request);
        User user = new User();
        user.setEmail(email);
        user.setName(completeProfileDTO.getName());
        user.setSurname(completeProfileDTO.getSurname());
        user.setPhoneNumber(completeProfileDTO.getPhoneNumber());
        user.setRole(Roles.USER);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        userRepository.save(user);

        return new UserResponseDTO(user);
    }

    @Transactional
    public void deleteUnfinished(HttpServletRequest request) {
        userRepository.deleteByEmail(Utils.getUserEmail(request));
    }

    private boolean isAdminEmail(Object email) {
        return Objects.equals(email, adminEmail);
    }
}

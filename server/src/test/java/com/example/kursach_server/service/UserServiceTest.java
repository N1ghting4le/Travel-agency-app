package com.example.kursach_server.service;

import com.example.kursach_server.dto.user.CreateUserDTO;
import com.example.kursach_server.requests.SignInRequest;
import com.example.kursach_server.dto.user.UserWithTokenDTO;
import com.example.kursach_server.exceptions.conflict.EntityAlreadyExistsException;
import com.example.kursach_server.exceptions.IncorrectPasswordException;
import com.example.kursach_server.exceptions.notFound.UserNotExistsException;
import com.example.kursach_server.models.User;
import com.example.kursach_server.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Testcontainers
@ActiveProfiles("test")
@SpringBootTest
@Transactional
public class UserServiceTest {

    @Container
    public static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @DynamicPropertySource
    static void postgresqlProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
    }

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String testEmail = "test@example.com";
    private final String testPassword = "testpassword";
    private final String testName = "Test User";
    private final String testSurname = "Testov";

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        User user = new User();
        user.setEmail(testEmail);
        user.setPhoneNumber("+1234567890");
        user.setPassword(passwordEncoder.encode(testPassword));
        user.setRole("USER");
        user.setName(testName);
        user.setSurname(testSurname);
        userRepository.save(user);
    }

    @Test
    void testSuccessfulAuthentication() throws UserNotExistsException, IncorrectPasswordException {
        SignInRequest request = new SignInRequest();
        request.setPhoneOrEmail(testEmail);
        request.setPassword(testPassword);

        UserWithTokenDTO userWithTokenDTO = userService.getUser(request);

        assertNotNull(userWithTokenDTO);
        assertNotNull(userWithTokenDTO.getToken());
        assertEquals(testEmail, userWithTokenDTO.getUser().getEmail());
    }

    @Test
    void testAuthenticationWithPhone() throws UserNotExistsException, IncorrectPasswordException {
        SignInRequest request = new SignInRequest();
        request.setPhoneOrEmail("+1234567890");
        request.setPassword(testPassword);

        UserWithTokenDTO userWithTokenDTO = userService.getUser(request);

        assertNotNull(userWithTokenDTO);
        assertEquals(testEmail, userWithTokenDTO.getUser().getEmail());
        assertEquals(testName, userWithTokenDTO.getUser().getName());
    }

    @Test
    void shouldCreateRegularUserSuccessfully() throws EntityAlreadyExistsException {
        CreateUserDTO dto = new CreateUserDTO();
        dto.setEmail("newuser@example.com");
        dto.setPassword("validPass123");
        dto.setName("John");
        dto.setSurname("Doe");
        dto.setPhoneNumber("+1234567891");

        UserWithTokenDTO result = userService.createUser(dto, mockRequestWithRegularUser());

        assertNotNull(result);
        assertNotNull(result.getToken());
        assertEquals("newuser@example.com", result.getUser().getEmail());
        assertEquals("USER", result.getUser().getRole());
        assertEquals("+1234567891", result.getUser().getPhoneNumber());
    }

    @Test
    void shouldThrowExceptionWhenEmailExists() {
        CreateUserDTO dto = new CreateUserDTO();
        dto.setEmail(testEmail);
        dto.setPassword("newPassword");
        dto.setName("Existing");
        dto.setSurname("User");
        dto.setPhoneNumber("+2222222222");

        assertThrows(EntityAlreadyExistsException.class,
                () -> userService.createUser(dto, mockRequestWithRegularUser()),
                "Пользователь с этим адресом эл. почты уже существует");
    }

    @Test
    void shouldThrowExceptionWhenPhoneExists() {
        CreateUserDTO dto = new CreateUserDTO();
        dto.setEmail("new@example.com");
        dto.setPassword("newPassword");
        dto.setName("New");
        dto.setSurname("User");
        dto.setPhoneNumber("+1234567890");

        assertThrows(EntityAlreadyExistsException.class,
                () -> userService.createUser(dto, mockRequestWithRegularUser()),
                "Пользователь с этим номером телефона уже существует");
    }

    private HttpServletRequest mockRequestWithRegularUser() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getAttribute("email")).thenReturn("regular@user.com");
        return request;
    }
}
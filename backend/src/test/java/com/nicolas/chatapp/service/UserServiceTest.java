package com.nicolas.chatapp.service;

import com.nicolas.chatapp.AbstractIntegrationTest;
import com.nicolas.chatapp.config.JwtConstants;
import com.nicolas.chatapp.controllers.AuthController;
import com.nicolas.chatapp.controllers.UserController;
import com.nicolas.chatapp.dto.request.LoginRequestDTO;
import com.nicolas.chatapp.dto.request.UpdateUserRequestDTO;
import com.nicolas.chatapp.dto.response.LoginResponseDTO;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.User;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest extends AbstractIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthController authController;

    private final UUID lukesId = UUID.fromString("be900497-cc68-4504-9b99-4e5deaf1e6c0");
    private final UUID vadersId = UUID.fromString("f290f384-60ba-4cdd-af96-26c88ede0264");
    private final UUID notExistingId = UUID.fromString("4d09862c-71b6-4719-aeda-f3d961ee89b9");

    @Test
    void findUserById() throws UserException {

        // Find user
        User user = userService.findUserById(lukesId);
        assertThat(user.getId()).isEqualTo(lukesId);

        // Find non-existing user
        assertThrows(UserException.class, () -> userService.findUserById(notExistingId));
    }

    @Test
    void findUserByProfile() throws UserException {

        // Get user
        String mail = "luke.skywalker@test.com";
        LoginRequestDTO request = new LoginRequestDTO(mail, "1234");
        LoginResponseDTO response = authController.login(request).getBody();
        assert response != null;
        String authorization = JwtConstants.TOKEN_PREFIX + response.token();
        User user = userService.findUserByProfile(authorization);
        assertThat(user.getId()).isEqualTo(lukesId);
        assertThat(user.getEmail()).isEqualTo(mail);

        // Get user with invalid jwt
        assertThrows(StringIndexOutOfBoundsException.class, () -> userService.findUserByProfile(""));
        assertThrows(IllegalArgumentException.class, () -> userService.findUserByProfile(JwtConstants.TOKEN_PREFIX));
        assertThrows(MalformedJwtException.class, () -> userService.findUserByProfile(JwtConstants.TOKEN_PREFIX + "12345678901234567890"));
        assertThrows(ExpiredJwtException.class, () -> userService.findUserByProfile(JwtConstants.TOKEN_PREFIX + "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjaGF0LWFwcC1iYWNrZW5kIiwiaWF0IjoxNzEyODQzODk4LCJleHAiOjE3MTI4NDc0OTgsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9.-vub9kKf5loCrb0DI03NlwegDYEQPr1WZzpdkhrDfXE"));
    }

    @Test
    void updateUser() throws UserException {

        // Update user
        String name = "Anakin Skywalker";
        String mail = "darth.vader@test.com";
        String password = "2345";
        UpdateUserRequestDTO request = new UpdateUserRequestDTO(mail, password, name);
        User user = userService.updateUser(vadersId, request);
        User repositoryUser = userService.findUserById(vadersId);
        assertThat(user.getId()).isEqualTo(vadersId);
        assertThat(user.getFullName()).isEqualTo(name);
        assertThat(user.getEmail()).isEqualTo(mail);
        assertThat(user.getPassword()).isNotEqualTo(password);
        assertThat(user).isEqualTo(repositoryUser);

        // Update non-existing user
        assertThrows(UserException.class, () -> userService.updateUser(notExistingId, request));
    }

    @Test
    void searchUser() throws UserException {

        // Search user by name
        User luke = userService.findUserById(lukesId);
        List<User> result = userService.searchUser("Luke");
        assertThat(result).containsExactly(luke);

        // Search by mail
        result = userService.searchUser("skywalker@test.com");
        assertThat(result).containsExactly(luke);
    }

    @Test
    void searchUserByName() throws UserException {

        // Search by name
        User luke = userService.findUserById(lukesId);
        List<User> result = userService.searchUserByName("Luke Skywalker");
        assertThat(result).containsExactly(luke);
    }

}
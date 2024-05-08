package com.nicolas.chatapp.controllers;

import com.nicolas.chatapp.AbstractIntegrationTest;
import com.nicolas.chatapp.config.JwtConstants;
import com.nicolas.chatapp.dto.request.LoginRequestDTO;
import com.nicolas.chatapp.dto.request.UpdateUserRequestDTO;
import com.nicolas.chatapp.dto.response.ApiResponseDTO;
import com.nicolas.chatapp.dto.response.LoginResponseDTO;
import com.nicolas.chatapp.dto.response.UserDTO;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.User;
import com.nicolas.chatapp.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class UserControllerTest extends AbstractIntegrationTest {

    @Autowired
    private UserController userController;

    @Autowired
    private AuthController authController;

    private final UUID lukesId = UUID.fromString("be900497-cc68-4504-9b99-4e5deaf1e6c0");
    private final UUID vadersId = UUID.fromString("f290f384-60ba-4cdd-af96-26c88ede0264");

    @Test
    void getUserProfile() throws UserException {
        // Get user
        String mail = "luke.skywalker@test.com";
        LoginRequestDTO request = new LoginRequestDTO(mail, "1234");
        LoginResponseDTO response = authController.login(request).getBody();
        assert response != null;
        String authorization = JwtConstants.TOKEN_PREFIX + response.token();
        ResponseEntity<UserDTO> result = userController.getUserProfile(authorization);
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(Objects.requireNonNull(result.getBody()).id()).isEqualTo(lukesId);
        assertThat(result.getBody().email()).isEqualTo(mail);

        // Get user with invalid jwt
        assertThrows(StringIndexOutOfBoundsException.class, () -> userController.getUserProfile(""));
        assertThrows(IllegalArgumentException.class, () -> userController.getUserProfile(JwtConstants.TOKEN_PREFIX));
        assertThrows(MalformedJwtException.class, () -> userController.getUserProfile(JwtConstants.TOKEN_PREFIX + "12345678901234567890"));
        assertThrows(ExpiredJwtException.class, () -> userController.getUserProfile(JwtConstants.TOKEN_PREFIX + "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjaGF0LWFwcC1iYWNrZW5kIiwiaWF0IjoxNzEyODQzODk4LCJleHAiOjE3MTI4NDc0OTgsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9.-vub9kKf5loCrb0DI03NlwegDYEQPr1WZzpdkhrDfXE"));
    }

    @Test
    void searchUsers() throws UserException {

        // Search user by name
        String mail = "luke.skywalker@test.com";
        LoginRequestDTO request = new LoginRequestDTO(mail, "1234");
        LoginResponseDTO response = authController.login(request).getBody();
        assert response != null;
        String authorization = JwtConstants.TOKEN_PREFIX + response.token();
        ResponseEntity<UserDTO> luke = userController.getUserProfile(authorization);
        ResponseEntity<List<UserDTO>> result = userController.searchUsers("Luke");
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).containsExactly(luke.getBody());

        // Search by mail
        result = userController.searchUsers("skywalker@test.com");
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).containsExactly(luke.getBody());
    }

    @Test
    void searchUsersByName() throws UserException {

        // Search user by name
        String mail = "luke.skywalker@test.com";
        LoginRequestDTO request = new LoginRequestDTO(mail, "1234");
        LoginResponseDTO response = authController.login(request).getBody();
        assert response != null;
        String authorization = JwtConstants.TOKEN_PREFIX + response.token();
        ResponseEntity<UserDTO> luke = userController.getUserProfile(authorization);
        ResponseEntity<Set<UserDTO>> result = userController.searchUsersByName("Luke Skywalker");
        assertThat(result.getBody()).containsExactly(luke.getBody());
    }

    @Test
    void updateUser() throws UserException {

        // Update user
        String name = "Anakin Skywalker";
        String mail = "darth.vader@test.com";
        String password = "2345";
        LoginRequestDTO loginRequest = new LoginRequestDTO(mail, "2345");
        LoginResponseDTO response = authController.login(loginRequest).getBody();
        assert response != null;
        String authorization = JwtConstants.TOKEN_PREFIX + response.token();
        UpdateUserRequestDTO request = new UpdateUserRequestDTO(mail, password, name);
        ResponseEntity<ApiResponseDTO> user = userController.updateUser(request, authorization);
        ResponseEntity<UserDTO> repositoryUser = userController.getUserProfile(authorization);
        assertThat(user.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(Objects.requireNonNull(repositoryUser.getBody()).id()).isEqualTo(vadersId);
        assertThat(repositoryUser.getBody().fullName()).isEqualTo(name);
        assertThat(repositoryUser.getBody().email()).isEqualTo(mail);
        assertThat(Objects.requireNonNull(user.getBody()).status()).isTrue();
    }

}
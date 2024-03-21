package com.nicolas.chatapp.controllers;

import com.nicolas.chatapp.auth.JwtUtil;
import com.nicolas.chatapp.dto.request.LoginRequestDTO;
import com.nicolas.chatapp.dto.response.ErrorResponseDTO;
import com.nicolas.chatapp.dto.response.LoginResponseDTO;
import com.nicolas.chatapp.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;


    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword()));
            String email = authentication.getName();
            User user = new User();
            user.setEmail(email);
            String token = jwtUtil.createToken(user);
            LoginResponseDTO loginResponseDTO = new LoginResponseDTO();
            loginResponseDTO.setEmail(email);
            loginResponseDTO.setToken(token);

            return ResponseEntity.ok(loginResponseDTO);
        } catch (BadCredentialsException e){
            ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
                    .httpStatus(HttpStatus.BAD_REQUEST)
                    .message("Invalid username or password")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
        } catch (Exception e) {
            ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
                    .httpStatus(HttpStatus.BAD_REQUEST)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponseDTO);
        }
    }
}

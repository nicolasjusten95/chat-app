package com.nicolas.chatapp.controllers;

import com.nicolas.chatapp.auth.TokenProvider;
import com.nicolas.chatapp.dto.request.LoginRequestDTO;
import com.nicolas.chatapp.dto.request.SignupRequestDTO;
import com.nicolas.chatapp.dto.response.LoginResponseDTO;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.User;
import com.nicolas.chatapp.repository.UserRepository;
import com.nicolas.chatapp.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService customUserDetailsService;

    @PostMapping("/signup")
    public ResponseEntity<LoginResponseDTO> signup(@RequestBody SignupRequestDTO signupRequestDTO) throws UserException {
        final String email = signupRequestDTO.email();
        final String password = signupRequestDTO.password();
        final String fullName = signupRequestDTO.fullName();

        User existingUser = userRepository.findByEmail(email);
        if (existingUser != null) {
            throw new UserException("Account with email " + email + " already exists");
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setFullName(fullName);
        userRepository.save(newUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        LoginResponseDTO loginResponseDTO = LoginResponseDTO.builder()
                .email(email)
                .token(jwt)
                .build();
        log.info("User {} successfully signed up", email);

        return ResponseEntity.accepted().body(loginResponseDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        final String email = loginRequestDTO.getEmail();
        final String password = loginRequestDTO.getPassword();
        Authentication authentication = authenticateReq(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        LoginResponseDTO loginResponseDTO = LoginResponseDTO.builder()
                .email(email)
                .token(jwt)
                .build();
        log.info("User {} successfully logged in", loginRequestDTO.getEmail());

        return ResponseEntity.ok(loginResponseDTO);
    }

    public Authentication authenticateReq(String username, String password) {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid Password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

}

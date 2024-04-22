package com.nicolas.chatapp.controllers;

import com.nicolas.chatapp.config.JwtConstants;
import com.nicolas.chatapp.dto.request.UpdateUserRequestDTO;
import com.nicolas.chatapp.dto.response.ApiResponseDTO;
import com.nicolas.chatapp.exception.UserException;
import com.nicolas.chatapp.model.User;
import com.nicolas.chatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader(JwtConstants.TOKEN_HEADER) String token) throws UserException {

        User user = userService.findUserByProfile(token);

        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @GetMapping("/{query}")
    public ResponseEntity<List<User>> searchUsers(@PathVariable String query) {

        List<User> users = userService.searchUser(query);

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Set<User>> searchUsersByName(@RequestParam("name") String name) {

        List<User> users = userService.searchUserByName(name);
        Set<User> userSet = new HashSet<>(users);

        return new ResponseEntity<>(userSet, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponseDTO> updateUser(@RequestBody UpdateUserRequestDTO request,
                                                     @RequestHeader(JwtConstants.TOKEN_HEADER) String token)
            throws UserException {

        User user = userService.findUserByProfile(token);
        userService.updateUser(user.getId(), request);
        log.info("User updated: {}", user.getEmail());

        ApiResponseDTO response = ApiResponseDTO.builder()
                .message("User updated")
                .status(true)
                .build();

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

}

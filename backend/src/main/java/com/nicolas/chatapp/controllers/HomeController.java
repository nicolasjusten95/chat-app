package com.nicolas.chatapp.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<String> home() {
        log.info("Welcome to my chat app");
        return new ResponseEntity<>("Welcome to my chat app", HttpStatus.OK);
    }

}

package com.nicolas.chatapp.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/home")
public class HomeController {

    @GetMapping
    public String hello() {
        return "hello world!";
    }

}

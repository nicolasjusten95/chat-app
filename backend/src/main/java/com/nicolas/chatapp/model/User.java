package com.nicolas.chatapp.model;

import lombok.Data;

@Data
public class User {

    private String email;
    private String password;
    private String firstName;
    private String lastName;
}

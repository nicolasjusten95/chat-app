package com.nicolas.chatapp.dto.response;

import lombok.Data;

@Data
public class LoginResponseDTO {

    private String email;
    private String token;
}

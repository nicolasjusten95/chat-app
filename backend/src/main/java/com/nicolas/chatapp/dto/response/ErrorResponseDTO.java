package com.nicolas.chatapp.dto.response;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class ErrorResponseDTO {

    HttpStatus httpStatus;
    String message;
}

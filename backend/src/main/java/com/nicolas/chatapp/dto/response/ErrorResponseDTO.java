package com.nicolas.chatapp.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Value;
import org.springframework.http.HttpStatus;

@Value
@Builder
public class ErrorResponseDTO {

    HttpStatus httpStatus;
    String message;
}

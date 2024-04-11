package com.nicolas.chatapp.dto.request;

public record UpdateUserRequestDTO(String email, String password, String fullName) {
}

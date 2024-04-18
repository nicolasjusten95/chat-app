package com.nicolas.chatapp.dto.request;

public record SendMessageRequestDTO(Long chatId, String content) {
}

package com.nicolas.chatapp.dto.request;

public record SendMessageRequestDTO(Integer chatId, String content, Integer userId) {
}

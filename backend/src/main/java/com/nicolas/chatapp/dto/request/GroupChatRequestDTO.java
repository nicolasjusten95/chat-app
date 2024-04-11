package com.nicolas.chatapp.dto.request;

import java.util.List;

public record GroupChatRequestDTO(List<Integer> userIds, String chatName) {
}

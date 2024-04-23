package com.nicolas.chatapp.dto.response;

import com.nicolas.chatapp.model.Chat;
import lombok.Builder;

import java.util.*;

@Builder
public record ChatDTO(
        UUID id,
        String chatName,
        Boolean isGroup,
        Set<UserDTO> admins,
        Set<UserDTO> users,
        UserDTO createdBy,
        List<MessageDTO> messages) {

    public static ChatDTO fromChat(Chat chat) {
        if (Objects.isNull(chat)) return null;
        return ChatDTO.builder()
                .id(chat.getId())
                .chatName(chat.getChatName())
                .isGroup(chat.getIsGroup())
                .admins(UserDTO.fromUsers(chat.getAdmins()))
                .users(UserDTO.fromUsers(chat.getUsers()))
                .createdBy(UserDTO.fromUser(chat.getCreatedBy()))
                .messages(MessageDTO.fromMessages(chat.getMessages()))
                .build();
    }

    public static List<ChatDTO> fromChats(Collection<Chat> chats) {
        if (Objects.isNull(chats)) return List.of();
        return chats.stream()
                .map(ChatDTO::fromChat)
                .toList();
    }

}

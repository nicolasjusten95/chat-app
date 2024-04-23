package com.nicolas.chatapp.dto.response;

import com.nicolas.chatapp.model.User;
import lombok.Builder;

import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Builder
public record UserDTO(UUID id, String email, String fullname) {

    public static UserDTO fromUser(User user) {
        if (Objects.isNull(user)) return null;
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullname(user.getFullName())
                .build();
    }

    public static Set<UserDTO> fromUsers(Set<User> users) {
        if (Objects.isNull(users)) return Set.of();
        return users.stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toSet());
    }

}

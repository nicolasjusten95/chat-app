package com.nicolas.chatapp.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.*;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Chat {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String chatName;
    private Boolean isGroup;

    @ManyToMany
    private Set<User> admins = new HashSet<>();

    @ManyToMany
    private Set<User> users = new HashSet<>();

    @ManyToOne
    private User createdBy;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Message> messages = new ArrayList<>();

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Chat other)) {
            return false;
        }
        return Objects.equals(chatName, other.getChatName())
                && Objects.equals(isGroup, other.getIsGroup())
                && Objects.equals(admins, other.getAdmins())
                && Objects.equals(users, other.getUsers())
                && Objects.equals(createdBy, other.getCreatedBy());
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatName, isGroup, admins, users, createdBy);
    }

    @Override
    public String toString() {
        return "Chat{" +
                "id=" + id +
                ", chatName='" + chatName + '\'' +
                ", isGroup=" + isGroup +
                '}';
    }

}

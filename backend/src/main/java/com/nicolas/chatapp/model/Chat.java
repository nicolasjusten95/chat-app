package com.nicolas.chatapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.*;

@Data
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
}

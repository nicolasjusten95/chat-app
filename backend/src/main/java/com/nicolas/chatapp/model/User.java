package com.nicolas.chatapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@Entity(name = "CHAT_USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true)
    private String email;

    private String password;
    private String fullName;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof User other)) {
            return false;
        }
        return Objects.equals(email, other.getEmail());
    }

    @Override
    public int hashCode() {
        return Objects.hash(email);
    }

}

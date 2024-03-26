package com.nicolas.chatapp.repository;

import com.nicolas.chatapp.model.User;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    // TODO: Transfer to real repository

    public User findByEmail(String email) {
        User user = new User();
        user.setEmail(email);
        // password: 1234 as bcrypt
        user.setPassword("$2a$12$0TjSkhITHjj8BDk8KjHUYu1ASnDBOFMYFgRJSpkmdLQnRJdwoVIvS");
        user.setFirstName("Luke");
        user.setLastName("Skywalker");
        return user;
    }

}

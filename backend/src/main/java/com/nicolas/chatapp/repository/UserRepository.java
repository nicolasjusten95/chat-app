package com.nicolas.chatapp.repository;

import com.nicolas.chatapp.model.User;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    public User findUserByEmail(String email) {
        User user = new User();
        user.setEmail(email);
        user.setPassword("1234");
        user.setFirstName("Luke");
        user.setLastName("Skywalker");
        return user;
    }

}

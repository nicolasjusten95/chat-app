package com.nicolas.chatapp.service;

import com.nicolas.chatapp.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class UserDetailsServiceTest extends AbstractIntegrationTest {

    @Autowired
    private UserDetailsService userDetailsService;

    @Test
    void loadUserByUsername() {

        // Load user
        String username = "luke.skywalker@test.com";
        UserDetails user = userDetailsService.loadUserByUsername(username);
        assertThat(user.getUsername()).isEqualTo(username);
        assertThat(user.getPassword()).isNotNull();

        // Load non-existing user
        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername("not.existing@test.com"));
    }

}
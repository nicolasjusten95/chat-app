package com.nicolas.chatapp.config;

public class JwtConstants {

    private JwtConstants() {
    }

    static final long ACCESS_TOKEN_VALIDITY = 60 * 60 * 1000L;
    static final String TOKEN_PREFIX = "Bearer ";
    static final String TOKEN_HEADER = "Authorization";
    static final String EMAIL = "email";
    static final String ISSUER = "chat-app-backend";
    static final String AUTHORITIES = "authorities";
    static final String SECRET_KEY = "f74463f962b6695f98ad10c04084383f6b60bff0d52330285e3fbf934ddb5fc0ba5148ddf71d83d22096b62f24c55cd29749bb4f23bf5b2cc6c8dad0f44e6033";
}

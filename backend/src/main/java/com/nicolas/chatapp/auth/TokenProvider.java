package com.nicolas.chatapp.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class TokenProvider {

    private final SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(JwtConstants.SECRET_KEY));
    private final JwtParser jwtParser;

    public TokenProvider() {
        this.jwtParser = Jwts.parser()
                .verifyWith(key)
                .build();
    }

    public String generateToken(Authentication authentication) {
        return Jwts.builder()
                .issuer(JwtConstants.ISSUER)
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + JwtConstants.ACCESS_TOKEN_VALIDITY))
                .claim(JwtConstants.EMAIL, authentication.getName())
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public Claims getClaimsFromToken(String jwt) {
        jwt = jwt.substring(JwtConstants.TOKEN_PREFIX.length());
        return jwtParser.parseSignedClaims(jwt).getPayload();
    }

}

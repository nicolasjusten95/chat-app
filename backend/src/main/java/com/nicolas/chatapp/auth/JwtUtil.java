package com.nicolas.chatapp.auth;

import com.nicolas.chatapp.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class JwtUtil {

    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(Decoders.BASE64.decode(JwtConstants.SECRET_KEY_PHRASE));

    private final JwtParser jwtParser;

    public JwtUtil() {
        this.jwtParser = Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build();
    }

    public String createToken(User user) {
        Claims claims = Jwts.claims()
                .subject(user.getEmail())
                .add("firstName", user.getFirstName())
                .add("lastName", user.getLastName())
                .build();
        Date tokenCreateTime = new Date();
        Date tokenValidity = new Date(tokenCreateTime.getTime() + TimeUnit.MINUTES.toMillis(JwtConstants.ACCESS_TOKEN_VALIDITY));
        return Jwts.builder()
                .claims(claims)
                .expiration(tokenValidity)
                .signWith(SECRET_KEY, Jwts.SIG.HS256)
                .compact();
    }

    private Claims parseJwtClaims(String token) {
        return jwtParser.parseSignedClaims(token).getPayload();
    }

    public Claims resolveClaims(HttpServletRequest request) {
        try {
            String token = resolveToken(request);
            if (token != null) {
                return parseJwtClaims(token);
            }
            return null;
        } catch (ExpiredJwtException e) {
            request.setAttribute("expired", e.getMessage());
            throw e;
        } catch (Exception e) {
            request.setAttribute("invalid", e.getMessage());
            throw e;
        }
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(JwtConstants.TOKEN_HEADER);
        if (bearerToken != null && bearerToken.startsWith(JwtConstants.TOKEN_PREFIX)) {
            return bearerToken.substring(JwtConstants.TOKEN_PREFIX.length());
        }
        return null;
    }

    public boolean validateClaims(Claims claims) {
        return claims.getExpiration().after(new Date());
    }

    public String getEmail(Claims claims) {
        return claims.getSubject();
    }

    private List<String> getRoles(Claims claims) {
        return (List<String>) claims.get("roles");
    }

}

package com.example.kursach_server.jwt;

import com.example.kursach_server.constants.Time;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil {
    private final SecretKey secretKey;
    private final JwtParser jwtParser;
    private final String roleKey = "role";

    public JwtTokenUtil(@Value("${token.secret}") String secretKey) {
        this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.jwtParser = Jwts.parserBuilder().setSigningKey(this.secretKey).build();
    }

    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(roleKey, "ROLE_" + role);
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + Time.TOKEN_VALIDITY);

        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(now)
            .setExpiration(validity)
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact();
    }

    public String getEmailFromToken(String token) throws ExpiredJwtException {
        return getClaims(token).getSubject();
    }

    public String getRoleFromToken(String token) throws ExpiredJwtException {
        return getClaims(token).get(roleKey, String.class);
    }

    private Claims getClaims(String token) throws ExpiredJwtException {
        return jwtParser.parseClaimsJws(token).getBody();
    }
}

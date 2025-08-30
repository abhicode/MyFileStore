package com.abhishek.dropboxclone.service;


import lombok.RequiredArgsConstructor;

import java.util.Date;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.abhishek.dropboxclone.entity.BlacklistedToken;
import com.abhishek.dropboxclone.entity.User;
import com.abhishek.dropboxclone.exception.AppExceptions.InvalidCredentialsException;
import com.abhishek.dropboxclone.exception.AppExceptions.UserAlreadyExistsException;
import com.abhishek.dropboxclone.repository.BlacklistRepository;
import com.abhishek.dropboxclone.repository.UserRepository;
import com.abhishek.dropboxclone.security.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final BlacklistRepository blacklistRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public void register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UserAlreadyExistsException("User already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public String login(String username, String password) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid username or password");
        }
        
        return jwtUtil.generateToken(username);
    }

    public void logout(String token) {
        if (jwtUtil.validateToken(token)) {
            Date expiry = jwtUtil.extractExpiration(token);
            BlacklistedToken blacklisted = new BlacklistedToken();
            blacklisted.setToken(token);
            blacklisted.setExpiry(expiry);
            blacklistRepository.save(blacklisted);
        }
    }
}

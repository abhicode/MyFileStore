package com.abhishek.dropboxclone.service;

import org.springframework.stereotype.Service;

import com.abhishek.dropboxclone.repository.BlacklistRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
    private final BlacklistRepository blacklistRepository;

    public boolean isBlacklisted(String token) {
        return blacklistRepository.existsByToken(token);
    }
}

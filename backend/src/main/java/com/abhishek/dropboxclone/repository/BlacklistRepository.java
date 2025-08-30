package com.abhishek.dropboxclone.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.abhishek.dropboxclone.entity.BlacklistedToken;

public interface BlacklistRepository extends MongoRepository<BlacklistedToken, String> {
    Optional<BlacklistedToken> findByToken(String token);
    boolean existsByToken(String token);
}

package com.abhishek.dropboxclone.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.abhishek.dropboxclone.entity.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUsername(String username);

}

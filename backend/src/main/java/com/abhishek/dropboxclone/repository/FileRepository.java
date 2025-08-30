package com.abhishek.dropboxclone.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.abhishek.dropboxclone.entity.FileDocument;

public interface FileRepository extends MongoRepository<FileDocument, String> {
    List<FileDocument> findByOwnerId(String ownerId);

}

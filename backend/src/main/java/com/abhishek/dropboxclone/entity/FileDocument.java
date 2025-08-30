package com.abhishek.dropboxclone.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document("files")
public class FileDocument {
    @Id
    private String id;

    private String filename;
    private String contentType;
    private long size;
    private String ownerId;
    private Date uploadedAt = new Date();
    private String storagePath;
}

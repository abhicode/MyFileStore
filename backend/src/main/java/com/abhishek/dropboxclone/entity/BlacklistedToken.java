package com.abhishek.dropboxclone.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document("blacklisted_tokens")
public class BlacklistedToken {
    @Id
    private String id;
    private String token;
    private Date expiry;
}

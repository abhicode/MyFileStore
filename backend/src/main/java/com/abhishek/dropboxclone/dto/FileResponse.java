package com.abhishek.dropboxclone.dto;

import lombok.Data;

@Data
public class FileResponse {
    private String id;
    private String filename;
    private String contentType;
    private long size;
    private String downloadUrl;
}

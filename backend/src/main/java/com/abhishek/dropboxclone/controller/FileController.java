package com.abhishek.dropboxclone.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.abhishek.dropboxclone.dto.FileResponse;
import com.abhishek.dropboxclone.entity.FileDocument;
import com.abhishek.dropboxclone.service.FileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileResponse> upload(@RequestParam("file") MultipartFile file, Authentication auth) {
        String ownerId = auth.getName();
        return ResponseEntity.ok(fileService.uploadFile(file, ownerId));
    }

    @GetMapping
    public ResponseEntity<List<FileResponse>> listUserFiles(Authentication auth) {
        String ownerId = auth.getName();
        return ResponseEntity.ok(fileService.listUserFiles(ownerId));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable String id, Authentication auth) throws FileNotFoundException {
        String ownerId = auth.getName();
        FileDocument doc = fileService.getFile(id, ownerId);

        File file = new File(doc.getStoragePath());
        // Resource resource = new FileSystemResource(file);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        System.out.println("DOCUMENT: " + doc.getContentType() + doc.getFilename());

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(doc.getContentType() != null ? doc.getContentType() : "application/octet-stream"))
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFilename() + "\"")
            .contentLength(file.length())
            .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable String id, Authentication auth) throws FileNotFoundException {
        String ownerId = auth.getName();
        fileService.deleteFile(id, ownerId);
        return ResponseEntity.noContent().build();
    }
}

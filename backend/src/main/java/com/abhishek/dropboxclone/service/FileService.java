package com.abhishek.dropboxclone.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.abhishek.dropboxclone.dto.FileResponse;
import com.abhishek.dropboxclone.entity.FileDocument;
import com.abhishek.dropboxclone.exception.AppExceptions.FileDeletionException;
import com.abhishek.dropboxclone.exception.AppExceptions.FileStorageException;
import com.abhishek.dropboxclone.repository.FileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileService {
    private final FileRepository fileRepository;

    private static final String STORAGE_DIR = "uploads/";

    public FileResponse uploadFile(MultipartFile multipartFile, String ownerId) {
        File dir = new File(STORAGE_DIR);

        if (!dir.exists() && !dir.mkdirs()) {
            throw new FileStorageException("Could not create storage directory: " + STORAGE_DIR, null);
        }
        String storedFileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
        File file = new File(STORAGE_DIR + storedFileName);

        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(multipartFile.getBytes());
        } catch (java.io.FileNotFoundException e) {
            throw new FileStorageException("File not found: " + file.getAbsolutePath(), e);
        } catch (java.io.IOException e) {
            throw new FileStorageException("Error writing file: " + file.getAbsolutePath(), e);
        }

        FileDocument document = new FileDocument();
        document.setFilename(multipartFile.getOriginalFilename());
        document.setContentType(multipartFile.getContentType());
        document.setSize(multipartFile.getSize());
        document.setOwnerId(ownerId);
        document.setStoragePath(file.getAbsolutePath());

        fileRepository.save(document);
        return mapToResponse(document);
    }

    public List<FileResponse> listUserFiles(String ownerId) {
        return fileRepository.findByOwnerId(ownerId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public FileDocument getFile(String fileId, String ownerId) throws FileNotFoundException {
        FileDocument doc = fileRepository.findById(fileId)
                .filter(f -> f.getOwnerId().equals(ownerId))
                .orElseThrow(() -> new FileNotFoundException("File not found!"));
        
        File file = new File(doc.getStoragePath());
        if (!file.exists()) {
            throw new FileNotFoundException("File not found on disk: " + doc.getStoragePath());
        }
        
        return doc;
    }

    private FileResponse mapToResponse(FileDocument doc) {
        FileResponse resp = new FileResponse();
        resp.setId(doc.getId());
        resp.setFilename(doc.getFilename());
        resp.setContentType(doc.getContentType());
        resp.setSize(doc.getSize());
        resp.setDownloadUrl("/api/files/" + doc.getId() + "/download");
        return resp;
    }

    public void deleteFile(String id, String ownerId) throws FileNotFoundException {
        FileDocument doc = fileRepository.findById(id)
            .filter(f -> f.getOwnerId().equals(ownerId))
            .orElseThrow(() -> new FileNotFoundException("File not found!"));

        File file = new File(doc.getStoragePath());
        if (file.exists() && !file.delete()) {
            throw new FileDeletionException("Failed to delete file from disk: " + file.getAbsolutePath());
        }

        fileRepository.delete(doc);
    }

}

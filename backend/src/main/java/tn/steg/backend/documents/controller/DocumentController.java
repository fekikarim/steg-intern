package tn.steg.backend.documents.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.documents.dto.DocumentResponse;
import tn.steg.backend.documents.dto.UploadDocumentRequest;
import tn.steg.backend.documents.service.DocumentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@Tag(name = "Documents", description = "Document management")
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR', 'CANDIDATE')")
    @Operation(summary = "Get documents by internship")
    public ResponseEntity<List<DocumentResponse>> getByInternship(@PathVariable UUID internshipId) {
        return ResponseEntity.ok(documentService.getDocumentsByInternship(internshipId));
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR', 'CANDIDATE')")
    @Operation(summary = "Upload document")
    public ResponseEntity<DocumentResponse> upload(@Valid @RequestBody UploadDocumentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentService.uploadDocument(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER')")
    @Operation(summary = "Delete document")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}

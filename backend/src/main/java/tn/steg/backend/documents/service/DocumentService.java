package tn.steg.backend.documents.service;

import tn.steg.backend.documents.dto.DocumentResponse;
import tn.steg.backend.documents.dto.UploadDocumentRequest;

import java.util.List;
import java.util.UUID;

public interface DocumentService {
    List<DocumentResponse> getDocumentsByInternship(UUID internshipId);
    DocumentResponse uploadDocument(UploadDocumentRequest request);
    void deleteDocument(UUID id);
}

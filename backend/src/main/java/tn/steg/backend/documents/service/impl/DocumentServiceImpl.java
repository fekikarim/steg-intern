package tn.steg.backend.documents.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.documents.dto.DocumentResponse;
import tn.steg.backend.documents.dto.UploadDocumentRequest;
import tn.steg.backend.documents.entity.*;
import tn.steg.backend.documents.repository.DocumentRepository;
import tn.steg.backend.documents.service.DocumentService;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.internships.entity.Internship;
import tn.steg.backend.internships.repository.InternshipRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final InternshipRepository internshipRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocumentsByInternship(UUID internshipId) {
        return documentRepository.findByInternshipId(internshipId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DocumentResponse uploadDocument(UploadDocumentRequest request) {
        Internship internship = internshipRepository.findById(request.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        InternshipDocument doc = new InternshipDocument();
        doc.setReference("DOC-" + System.currentTimeMillis());
        doc.setType(request.getType());
        doc.setStorageKey(request.getStorageKey());
        doc.setMimeType(request.getMimeType());
        doc.setSize(request.getSize());
        doc.setGeneratedAutomatically(false);
        doc.setInternship(internship);

        return toResponse(documentRepository.save(doc));
    }

    @Override
    @Transactional
    public void deleteDocument(UUID id) {
        if (!documentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Document not found");
        }
        documentRepository.deleteById(id);
    }

    private DocumentResponse toResponse(Document doc) {
        return DocumentResponse.builder()
                .id(doc.getId())
                .reference(doc.getReference())
                .type(doc.getType())
                .storageKey(doc.getStorageKey())
                .mimeType(doc.getMimeType())
                .size(doc.getSize())
                .version(doc.getVersion())
                .generatedAutomatically(doc.getGeneratedAutomatically())
                .createdDate(doc.getCreatedDate())
                .internshipId(doc.getInternship().getId())
                .build();
    }
}

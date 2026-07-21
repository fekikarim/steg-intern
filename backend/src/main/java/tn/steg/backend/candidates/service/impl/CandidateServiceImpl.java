package tn.steg.backend.candidates.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.candidates.dto.CandidateResponse;
import tn.steg.backend.candidates.dto.CreateCandidateRequest;
import tn.steg.backend.candidates.entity.Candidate;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.candidates.service.CandidateService;
import tn.steg.backend.exception.ResourceNotFoundException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<CandidateResponse> getAllCandidates(Pageable pageable) {
        return candidateRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResponse getCandidateById(UUID id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        return toResponse(candidate);
    }

    @Override
    @Transactional
    public CandidateResponse createCandidate(CreateCandidateRequest request) {
        Candidate candidate = Candidate.builder()
                .nationalId(request.getNationalId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .contactEmail(request.getContactEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .university(request.getUniversity())
                .speciality(request.getSpeciality())
                .diploma(request.getDiploma())
                .skills(request.getSkills())
                .languages(request.getLanguages())
                .build();
        return toResponse(candidateRepository.save(candidate));
    }

    private CandidateResponse toResponse(Candidate c) {
        return CandidateResponse.builder()
                .id(c.getId())
                .nationalId(c.getNationalId())
                .firstName(c.getFirstName())
                .lastName(c.getLastName())
                .contactEmail(c.getContactEmail())
                .phone(c.getPhone())
                .address(c.getAddress())
                .university(c.getUniversity())
                .speciality(c.getSpeciality())
                .diploma(c.getDiploma())
                .skills(c.getSkills())
                .languages(c.getLanguages())
                .build();
    }
}

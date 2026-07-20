package tn.steg.backend.candidates.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.steg.backend.candidates.dto.CandidateResponse;
import tn.steg.backend.candidates.dto.CreateCandidateRequest;

import java.util.UUID;

public interface CandidateService {
    Page<CandidateResponse> getAllCandidates(Pageable pageable);
    CandidateResponse getCandidateById(UUID id);
    CandidateResponse createCandidate(CreateCandidateRequest request);
}

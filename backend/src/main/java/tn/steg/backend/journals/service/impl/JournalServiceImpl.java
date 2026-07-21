package tn.steg.backend.journals.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.internships.entity.Internship;
import tn.steg.backend.internships.repository.InternshipRepository;
import tn.steg.backend.journals.dto.CreateJournalEntryRequest;
import tn.steg.backend.journals.dto.JournalEntryResponse;
import tn.steg.backend.journals.dto.JournalResponse;
import tn.steg.backend.journals.entity.InternshipJournal;
import tn.steg.backend.journals.entity.JournalEntry;
import tn.steg.backend.journals.entity.JournalStatus;
import tn.steg.backend.journals.repository.InternshipJournalRepository;
import tn.steg.backend.journals.repository.JournalEntryRepository;
import tn.steg.backend.journals.service.JournalService;

import java.time.LocalDate;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalServiceImpl implements JournalService {

    private final InternshipJournalRepository journalRepository;
    private final JournalEntryRepository entryRepository;
    private final InternshipRepository internshipRepository;

    @Override
    @Transactional(readOnly = true)
    public JournalResponse getJournalByInternship(UUID internshipId) {
        InternshipJournal journal = journalRepository.findByInternshipId(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Journal not found for this internship"));
        return toResponse(journal);
    }

    @Override
    @Transactional
    public JournalEntryResponse createEntry(CreateJournalEntryRequest request) {
        InternshipJournal journal = journalRepository.findById(request.getJournalId())
                .orElseThrow(() -> new ResourceNotFoundException("Journal not found"));

        JournalEntry entry = JournalEntry.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(JournalStatus.DRAFT)
                .entryDate(LocalDate.now())
                .journal(journal)
                .build();

        return toEntryResponse(entryRepository.save(entry));
    }

    @Override
    @Transactional
    public JournalEntryResponse validateEntry(UUID entryId) {
        JournalEntry entry = entryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found"));
        if (entry.getStatus() != JournalStatus.SUBMITTED) {
            throw new BusinessException("Only submitted entries can be validated");
        }
        entry.setStatus(JournalStatus.VALIDATED);
        return toEntryResponse(entryRepository.save(entry));
    }

    @Override
    @Transactional
    public JournalEntryResponse rejectEntry(UUID entryId) {
        JournalEntry entry = entryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found"));
        if (entry.getStatus() != JournalStatus.SUBMITTED) {
            throw new BusinessException("Only submitted entries can be rejected");
        }
        entry.setStatus(JournalStatus.REJECTED);
        return toEntryResponse(entryRepository.save(entry));
    }

    private JournalResponse toResponse(InternshipJournal j) {
        return JournalResponse.builder()
                .id(j.getId())
                .createdDate(j.getCreatedDate())
                .internshipId(j.getInternship().getId())
                .entries(j.getEntries().stream().map(this::toEntryResponse).collect(Collectors.toSet()))
                .build();
    }

    private JournalEntryResponse toEntryResponse(JournalEntry e) {
        return JournalEntryResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .description(e.getDescription())
                .status(e.getStatus())
                .entryDate(e.getEntryDate())
                .build();
    }
}

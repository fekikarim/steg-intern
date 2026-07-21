package tn.steg.backend.journals.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.journals.dto.CreateJournalEntryRequest;
import tn.steg.backend.journals.dto.JournalEntryResponse;
import tn.steg.backend.journals.dto.JournalResponse;
import tn.steg.backend.journals.service.JournalService;

import java.util.UUID;

@RestController
@RequestMapping("/journals")
@RequiredArgsConstructor
@Tag(name = "Journals", description = "Internship journal management")
public class JournalController {

    private final JournalService journalService;

    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR', 'CANDIDATE')")
    @Operation(summary = "Get journal by internship")
    public ResponseEntity<JournalResponse> getJournalByInternship(@PathVariable UUID internshipId) {
        return ResponseEntity.ok(journalService.getJournalByInternship(internshipId));
    }

    @PostMapping("/entries")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'CANDIDATE')")
    @Operation(summary = "Create journal entry")
    public ResponseEntity<JournalEntryResponse> createEntry(@Valid @RequestBody CreateJournalEntryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(journalService.createEntry(request));
    }

    @PatchMapping("/entries/{entryId}/validate")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SUPERVISOR')")
    @Operation(summary = "Validate journal entry")
    public ResponseEntity<JournalEntryResponse> validateEntry(@PathVariable UUID entryId) {
        return ResponseEntity.ok(journalService.validateEntry(entryId));
    }

    @PatchMapping("/entries/{entryId}/reject")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SUPERVISOR')")
    @Operation(summary = "Reject journal entry")
    public ResponseEntity<JournalEntryResponse> rejectEntry(@PathVariable UUID entryId) {
        return ResponseEntity.ok(journalService.rejectEntry(entryId));
    }
}

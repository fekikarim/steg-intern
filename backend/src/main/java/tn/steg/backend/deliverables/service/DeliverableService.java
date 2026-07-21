package tn.steg.backend.deliverables.service;

import tn.steg.backend.deliverables.dto.CreateDeliverableRequest;
import tn.steg.backend.deliverables.dto.DeliverableResponse;

import java.util.List;
import java.util.UUID;

public interface DeliverableService {
    List<DeliverableResponse> getDeliverablesByInternship(UUID internshipId);
    DeliverableResponse createDeliverable(CreateDeliverableRequest request);
    DeliverableResponse submitDeliverable(UUID id);
    DeliverableResponse validateDeliverable(UUID id, UUID validatedById);
    DeliverableResponse rejectDeliverable(UUID id, UUID validatedById);
}

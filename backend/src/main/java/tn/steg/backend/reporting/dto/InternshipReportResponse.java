package tn.steg.backend.reporting.dto;

import lombok.Builder;
import lombok.Getter;

/** Aggregated internship statistics for management reporting. */
@Getter
@Builder
public class InternshipReportResponse {

    private final long total;
    private final long planned;
    private final long active;
    private final long completed;
    private final long cancelled;
    private final long archived;
}

package tn.steg.backend.internships.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalInternships;
    private long planned;
    private long active;
    private long completed;
    private long cancelled;
    private long archived;
    private long upcomingStarts;
    private long upcomingEndings;
    private long pendingAssignments;
}

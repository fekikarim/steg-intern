package tn.steg.backend.workflows.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.users.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_actions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkflowAction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private WorkflowActionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApprovalDecision decision = ApprovalDecision.PENDING;

    private String comment;
    private String remarks;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "performed_at")
    private LocalDateTime performedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_step_id", nullable = false)
    private WorkflowStep workflowStep;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_id")
    private User performedBy;
}

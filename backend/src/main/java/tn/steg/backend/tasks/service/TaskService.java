package tn.steg.backend.tasks.service;

import tn.steg.backend.tasks.dto.CreateTaskRequest;
import tn.steg.backend.tasks.dto.TaskResponse;
import tn.steg.backend.tasks.entity.TaskStatus;

import java.util.List;
import java.util.UUID;

public interface TaskService {
    List<TaskResponse> getTasksByInternship(UUID internshipId);
    TaskResponse createTask(CreateTaskRequest request);
    TaskResponse updateStatus(UUID id, TaskStatus status);
}

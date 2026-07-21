package tn.steg.backend.tasks.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.internships.entity.Internship;
import tn.steg.backend.internships.repository.InternshipRepository;
import tn.steg.backend.tasks.dto.CreateTaskRequest;
import tn.steg.backend.tasks.dto.TaskResponse;
import tn.steg.backend.tasks.entity.Task;
import tn.steg.backend.tasks.entity.TaskStatus;
import tn.steg.backend.tasks.repository.TaskRepository;
import tn.steg.backend.tasks.service.TaskService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final InternshipRepository internshipRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByInternship(UUID internshipId) {
        return taskRepository.findByInternshipId(internshipId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        Internship internship = internshipRepository.findById(request.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TaskStatus.TODO)
                .dueDate(request.getDueDate())
                .internship(internship)
                .build();

        return toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional
    public TaskResponse updateStatus(UUID id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        task.setStatus(status);
        return toResponse(taskRepository.save(task));
    }

    private TaskResponse toResponse(Task t) {
        return TaskResponse.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .status(t.getStatus())
                .dueDate(t.getDueDate())
                .internshipId(t.getInternship().getId())
                .build();
    }
}

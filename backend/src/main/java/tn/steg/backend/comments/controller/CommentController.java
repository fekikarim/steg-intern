package tn.steg.backend.comments.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.comments.dto.CommentResponse;
import tn.steg.backend.comments.dto.CreateCommentRequest;
import tn.steg.backend.comments.service.CommentService;
import tn.steg.backend.users.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Comment management")
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get comments by target")
    public ResponseEntity<List<CommentResponse>> getComments(
            @RequestParam String targetType, @RequestParam UUID targetId) {
        return ResponseEntity.ok(commentService.getCommentsByTarget(targetType, targetId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR')")
    @Operation(summary = "Create comment")
    public ResponseEntity<CommentResponse> create(
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        var user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.createComment(request, user.getId()));
    }
}

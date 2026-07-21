package tn.steg.backend.comments.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.comments.dto.CommentResponse;
import tn.steg.backend.comments.dto.CreateCommentRequest;
import tn.steg.backend.comments.entity.Comment;
import tn.steg.backend.comments.repository.CommentRepository;
import tn.steg.backend.comments.service.CommentService;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.repository.UserRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTarget(String targetType, UUID targetId) {
        return commentRepository.findByTargetTypeAndTargetId(targetType, targetId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentResponse createComment(CreateCommentRequest request, UUID authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .targetType(request.getTargetType())
                .targetId(request.getTargetId())
                .author(author)
                .build();

        return toResponse(commentRepository.save(comment));
    }

    private CommentResponse toResponse(Comment c) {
        return CommentResponse.builder()
                .id(c.getId())
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .targetType(c.getTargetType())
                .targetId(c.getTargetId())
                .authorId(c.getAuthor().getId())
                .authorName(c.getAuthor().getEmail())
                .build();
    }
}

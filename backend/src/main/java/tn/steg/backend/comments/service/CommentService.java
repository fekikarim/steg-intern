package tn.steg.backend.comments.service;

import tn.steg.backend.comments.dto.CommentResponse;
import tn.steg.backend.comments.dto.CreateCommentRequest;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    List<CommentResponse> getCommentsByTarget(String targetType, UUID targetId);
    CommentResponse createComment(CreateCommentRequest request, UUID authorId);
}

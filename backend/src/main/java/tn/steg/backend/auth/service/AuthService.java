package tn.steg.backend.auth.service;

import tn.steg.backend.auth.dto.AuthResponse;
import tn.steg.backend.auth.dto.LoginRequest;
import tn.steg.backend.auth.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout(String refreshToken);
    void register(RegisterRequest request);
}

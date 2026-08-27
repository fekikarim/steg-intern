package tn.steg.backend.auth.service;

import tn.steg.backend.auth.dto.AuthResponse;
import tn.steg.backend.auth.dto.ChangePasswordRequest;
import tn.steg.backend.auth.dto.ForgotPasswordRequest;
import tn.steg.backend.auth.dto.LoginRequest;
import tn.steg.backend.auth.dto.RegisterRequest;
import tn.steg.backend.auth.dto.ResetPasswordRequest;
import tn.steg.backend.users.dto.UserProfileResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
    void logout(String refreshToken);
    void register(RegisterRequest request);
    UserProfileResponse me();
    void changePassword(ChangePasswordRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}

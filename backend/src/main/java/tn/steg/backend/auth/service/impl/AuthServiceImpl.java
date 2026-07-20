package tn.steg.backend.auth.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.auth.dto.AuthResponse;
import tn.steg.backend.auth.dto.LoginRequest;
import tn.steg.backend.auth.dto.RegisterRequest;
import tn.steg.backend.auth.service.AuthService;
import tn.steg.backend.candidates.entity.Candidate;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.security.JwtTokenProvider;
import tn.steg.backend.users.entity.RefreshToken;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.entity.UserStatus;
import tn.steg.backend.users.repository.RefreshTokenRepository;
import tn.steg.backend.users.repository.RoleRepository;
import tn.steg.backend.users.repository.UserRepository;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CandidateRepository candidateRepository;

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("User not found"));

        RefreshToken token = RefreshToken.builder()
                .token(refreshToken)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .user(user)
                .build();
        refreshTokenRepository.save(token);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration() / 1000)
                .build();
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException("Invalid refresh token");
        }

        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new BusinessException("Refresh token not found"));

        if (storedToken.getRevoked() || storedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Refresh token is expired or revoked");
        }

        User user = storedToken.getUser();
        String newAccessToken = jwtTokenProvider.generateAccessToken(
                new UsernamePasswordAuthenticationToken(user.getEmail(), null));

        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        String newRefreshToken = jwtTokenProvider.generateRefreshToken(
                new UsernamePasswordAuthenticationToken(user.getEmail(), null));

        RefreshToken newToken = RefreshToken.builder()
                .token(newRefreshToken)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .user(user)
                .build();
        refreshTokenRepository.save(newToken);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration() / 1000)
                .build();
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        var candidateRole = roleRepository.findByName("CANDIDATE")
                .orElseThrow(() -> new BusinessException("Candidate role not found"));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .status(UserStatus.ACTIVE)
                .role(candidateRole)
                .build();
        userRepository.save(user);

        Candidate candidate = Candidate.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .contactEmail(request.getEmail())
                .phone(request.getPhone())
                .university(request.getUniversity())
                .speciality(request.getSpeciality())
                .build();
        candidateRepository.save(candidate);
    }
}

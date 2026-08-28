import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/providers.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/models/candidate.dart';
import '../../../core/storage/token_storage.dart';
import '../data/auth_repository.dart';

/// Authentication state exposed to the widget tree.
class AuthState {
  const AuthState({this.profile, this.isRestoring = true, this.error});

  final CandidateProfile? profile;
  final bool isRestoring;

  /// Non-null when the last action failed (surfaced to login/register screens).
  final ApiException? error;

  bool get isAuthenticated => profile != null;

  AuthState copyWith({
    CandidateProfile? profile,
    bool? isRestoring,
    ApiException? error,
    bool clearError = false,
  }) =>
      AuthState(
        profile: profile ?? this.profile,
        isRestoring: isRestoring ?? this.isRestoring,
        error: clearError ? null : (error ?? this.error),
      );
}

class AuthController extends Notifier<AuthState> {
  @override
  AuthState build() {
    _restoreSession();
    return const AuthState();
  }

  AuthRepository get _repo => ref.read(authRepositoryProvider);
  TokenStorage get _storage => ref.read(tokenStorageProvider);

  Future<void> _restoreSession() async {
    final has = await _storage.hasTokens();
    if (!has) {
      state = const AuthState(isRestoring: false);
      return;
    }
    try {
      final profile = await _repo.fetchMyProfile();
      state = AuthState(profile: profile, isRestoring: false);
    } catch (_) {
      await _storage.clear();
      state = const AuthState(isRestoring: false);
    }
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isRestoring: true, clearError: true);
    try {
      final session = await _repo.login(email, password);
      await _storage.save(session.accessToken, session.refreshToken);
      final profile = await _repo.fetchMyProfile();
      state = AuthState(profile: profile, isRestoring: false);
    } on Object catch (e, st) {
      state = AuthState(
        isRestoring: false,
        error: apiError(e, st),
      );
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? phone,
    String? university,
    String? speciality,
  }) async {
    state = state.copyWith(isRestoring: true, clearError: true);
    try {
      await _repo.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        university: university,
        speciality: speciality,
      );
      await login(email, password);
    } on Object catch (e, st) {
      state = AuthState(
        isRestoring: false,
        error: apiError(e, st),
      );
    }
  }

  Future<void> logout() async {
    final refresh = await _storage.readRefreshToken();
    if (refresh != null) {
      await _repo.logout(refresh);
    } else {
      await _storage.clear();
    }
    state = const AuthState(isRestoring: false);
  }

  /// Hard session invalidation used by the Dio 401 interceptor.
  void forceLogout() {
    state = const AuthState(isRestoring: false);
  }
}

final authControllerProvider =
    NotifierProvider<AuthController, AuthState>(AuthController.new);

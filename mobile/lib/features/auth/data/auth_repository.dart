import 'package:dio/dio.dart';

import '../../../core/models/candidate.dart';
import '../../../core/storage/token_storage.dart';

/// Result of a successful authentication (tokens + cached profile).
class AuthSession {
  const AuthSession({
    required this.accessToken,
    required this.refreshToken,
    this.profile,
  });

  final String accessToken;
  final String refreshToken;
  final CandidateProfile? profile;
}

/// Abstraction over the backend auth API so UI/controllers never touch Dio.
abstract interface class AuthRepository {
  Future<AuthSession> login(String email, String password);

  Future<void> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? phone,
    String? university,
    String? speciality,
  });

  Future<CandidateProfile> fetchMyProfile();

  Future<void> logout(String refreshToken);
}

class ApiAuthRepository implements AuthRepository {
  ApiAuthRepository({required Dio dio, required TokenStorage tokenStorage})
      : _dio = dio,
        _tokenStorage = tokenStorage;

  final Dio _dio;
  final TokenStorage _tokenStorage;

  @override
  Future<AuthSession> login(String email, String password) async {
    final resp = await _dio.post<Map<String, dynamic>>(
      '/auth/login',
      data: {'email': email, 'password': password},
    );
    final data = resp.data!;
    return AuthSession(
      accessToken: data['accessToken'] as String,
      refreshToken: data['refreshToken'] as String,
    );
  }

  @override
  Future<void> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? phone,
    String? university,
    String? speciality,
  }) async {
    await _dio.post<void>(
      '/auth/register',
      data: {
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        if (phone != null && phone.isNotEmpty) 'phone': phone,
        if (university != null && university.isNotEmpty) 'university': university,
        if (speciality != null && speciality.isNotEmpty) 'speciality': speciality,
      },
    );
  }

  @override
  Future<CandidateProfile> fetchMyProfile() async {
    final resp = await _dio.get<Map<String, dynamic>>('/candidates/me');
    return CandidateProfile.fromJson(resp.data!);
  }

  @override
  Future<void> logout(String refreshToken) async {
    try {
      await _dio.post<void>('/auth/logout', data: {'refreshToken': refreshToken});
    } on DioException {
      // Best-effort; local token clear happens regardless.
    }
    await _tokenStorage.clear();
  }
}

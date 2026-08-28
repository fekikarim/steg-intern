import 'package:dio/dio.dart';

import '../config/app_config.dart';
import '../storage/token_storage.dart';

/// Configured [Dio] instance shared across the app.
///
/// Responsibilities:
///  * attach the JWT access token to every request,
///  * transparently refresh the access token once via `/auth/refresh` when the
///    server answers 401,
///  * if refresh fails, clear the session and expose an `onSessionExpired`
///    callback so the UI can route back to login.
class DioClient {
  DioClient({
    required TokenStorage tokenStorage,
    Dio? dio,
    void Function()? onSessionExpired,
    String? baseUrl,
  })  : _tokenStorage = tokenStorage,
        _onSessionExpired = onSessionExpired {
    _dio = dio ??
        Dio(
          BaseOptions(
            baseUrl: baseUrl ?? AppConfig.apiBaseUrl,
            connectTimeout: const Duration(seconds: 15),
            receiveTimeout: const Duration(seconds: 20),
            headers: {'Accept': 'application/json'},
          ),
        );
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: _onRequest,
        onError: _onError,
      ),
    );
  }

  late final Dio _dio;
  final TokenStorage _tokenStorage;
  final void Function()? _onSessionExpired;
  bool _refreshing = false;

  Dio get dio => _dio;

  Future<void> _onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _tokenStorage.readAccessToken();
    if (token != null && !options.path.contains('/auth/')) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  Future<void> _onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final status = err.response?.statusCode;
    if (status != 401 || _refreshing) {
      handler.next(err);
      return;
    }

    final refreshToken = await _tokenStorage.readRefreshToken();
    if (refreshToken == null) {
      _expireSession();
      handler.next(err);
      return;
    }

    try {
      _refreshing = true;
      final fresh = await _dio.post<Map<String, dynamic>>(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );
      final data = fresh.data!;
      final newAccess = data['accessToken'] as String;
      final newRefresh = data['refreshToken'] as String;
      await _tokenStorage.save(newAccess, newRefresh);

      final retried = await _dio.fetch<dynamic>(
        err.requestOptions.copyWith(
          headers: {
            ...err.requestOptions.headers,
            'Authorization': 'Bearer $newAccess',
          },
        ),
      );
      handler.resolve(retried);
    } catch (_) {
      await _expireSession();
      handler.next(err);
    } finally {
      _refreshing = false;
    }
  }

  Future<void> _expireSession() async {
    await _tokenStorage.clear();
    _onSessionExpired?.call();
  }
}

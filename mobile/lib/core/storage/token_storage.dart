import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Persists the JWT access + refresh tokens in the platform secure storage
/// (Keychain on iOS, EncryptedSharedPreferences/Keystore on Android).
///
/// Never store tokens in plain SharedPreferences — the spec mandates encrypted
/// local storage for all sensitive data.
class TokenStorage {
  TokenStorage({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  static const _accessKey = 'steg_access_token';
  static const _refreshKey = 'steg_refresh_token';

  final FlutterSecureStorage _storage;

  Future<void> save(String accessToken, String refreshToken) async {
    await _storage.write(key: _accessKey, value: accessToken);
    await _storage.write(key: _refreshKey, value: refreshToken);
  }

  Future<String?> readAccessToken() =>
      _storage.read(key: _accessKey);

  Future<String?> readRefreshToken() =>
      _storage.read(key: _refreshKey);

  Future<bool> hasTokens() async {
    final access = await readAccessToken();
    final refresh = await readRefreshToken();
    return access != null && refresh != null;
  }

  Future<void> clear() async {
    await _storage.delete(key: _accessKey);
    await _storage.delete(key: _refreshKey);
  }
}

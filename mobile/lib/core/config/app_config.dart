/// Application-wide configuration.
///
/// The STEG backend base URL can be overridden at build/run time with:
///   flutter run --dart-define=API_BASE_URL=http://192.168.1.20:8080/api/v1
class AppConfig {
  AppConfig._();

  static const String defaultBaseUrl = 'http://10.0.2.2:8080/api/v1';

  /// Backend REST API root (context path `/api/v1`).
  ///
  /// `10.0.2.2` is the Android emulator alias for the host loopback. A real
  /// device running against a LAN-hosted backend must pass `API_BASE_URL`.
  static String get apiBaseUrl =>
      const String.fromEnvironment('API_BASE_URL').isNotEmpty
          ? const String.fromEnvironment('API_BASE_URL')
          : defaultBaseUrl;

  /// Whether the user must be treated as a CANDIDATE (intern).
  static const String appName = 'STEG Internship Companion';
}

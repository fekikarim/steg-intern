import 'package:dio/dio.dart';

/// Typed error surfaced to the UI after a failed backend call.
///
/// The STEG backend returns a consistent error envelope:
/// `{ "timestamp", "code", "status", "message", "path" }`. We surface the
/// human-readable `message` and never leak stack traces to the user.
class ApiException implements Exception {
  const ApiException({required this.message, this.code, this.statusCode});

  final String message;
  final String? code;
  final int? statusCode;

  bool get isUnauthorized => statusCode == 401;

  /// Builds the friendliest possible message from a Dio error.
  factory ApiException.fromDio(Object error) {
    if (error is DioException) {
      final response = error.response;
      final data = response?.data;

      // Backend envelope.
      if (data is Map && data['message'] is String) {
        return ApiException(
          message: data['message'] as String,
          code: data['code'] as String?,
          statusCode: response?.statusCode,
        );
      }

      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
        case DioExceptionType.connectionError:
          return const ApiException(
            message: 'Unable to reach the server. Check your connection.',
            statusCode: -1,
          );
        case DioExceptionType.cancel:
          return const ApiException(message: 'Request cancelled.');
        case DioExceptionType.transformTimeout:
          return const ApiException(
            message: 'The server took too long to respond.',
            statusCode: -1,
          );
        case DioExceptionType.badResponse:
          return ApiException(
            message: response?.statusMessage ?? 'Server error.',
            statusCode: response?.statusCode,
          );
        case DioExceptionType.badCertificate:
          return const ApiException(message: 'Server certificate error.');
        case DioExceptionType.unknown:
          return const ApiException(message: 'Something went wrong.');
      }
    }

    return ApiException(message: 'Unexpected error: ${error.runtimeType}');
  }

  @override
  String toString() => message;
}

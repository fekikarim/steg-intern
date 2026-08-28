import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/api_exception.dart';
import '../../core/network/dio_client.dart';
import '../../core/storage/token_storage.dart';
import '../../features/auth/data/auth_repository.dart';
import '../../features/auth/presentation/auth_controller.dart';
import '../../features/home/data/home_repository.dart';

/// Secure storage for JWT tokens.
final tokenStorageProvider = Provider<TokenStorage>((ref) => TokenStorage());

/// Configured HTTP client with the auth (refresh) interceptor.
final dioClientProvider = Provider<DioClient>((ref) {
  final client = DioClient(
    tokenStorage: ref.watch(tokenStorageProvider),
    onSessionExpired: () {
      // Clear the session; the router's auth redirect watches the auth
      // controller and will route back to login automatically.
      ref.read(authControllerProvider.notifier).forceLogout();
    },
  );
  return client;
});

final dioProvider = Provider((ref) => ref.watch(dioClientProvider).dio);

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => ApiAuthRepository(
    dio: ref.watch(dioProvider),
    tokenStorage: ref.watch(tokenStorageProvider),
  ),
);

final homeRepositoryProvider = Provider<HomeRepository>(
  (ref) => ApiHomeRepository(ref.watch(dioProvider)),
);

/// Translates raw errors into [ApiException] for the UI.
ApiException apiError(Object error, StackTrace st) => ApiException.fromDio(error);

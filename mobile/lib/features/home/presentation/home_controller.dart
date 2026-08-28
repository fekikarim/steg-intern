import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/providers.dart';
import '../../../core/network/api_exception.dart';
import '../data/home_repository.dart';

/// Loads the intern dashboard aggregation and exposes it as async state.
class HomeController extends AsyncNotifier<DashboardData> {
  @override
  Future<DashboardData> build() => ref.read(homeRepositoryProvider).fetchDashboard();

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(homeRepositoryProvider).fetchDashboard(),
    );
  }

  /// Re-map a raw error into a friendly [ApiException] message.
  ApiException toApiError(Object error, StackTrace st) => apiError(error, st);
}

final homeControllerProvider =
    AsyncNotifierProvider<HomeController, DashboardData>(HomeController.new);

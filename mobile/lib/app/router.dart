import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/presentation/auth_controller.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/register_screen.dart';
import '../features/home/presentation/dashboard_screen.dart';
import '../features/home/presentation/home_shell.dart';
import '../features/home/presentation/profile_screen.dart';
import '../features/home/presentation/timeline_screen.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();

/// Builds the app router. The `redirect` watches the auth controller and
/// enforces the authenticated/guest boundary.
GoRouter _router(Ref ref) {
  final goRouter = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/app',
    redirect: (context, state) {
      final auth = ref.read(authControllerProvider);
      final loggingIn = state.matchedLocation == '/login' ||
          state.matchedLocation == '/register';

      if (auth.isAuthenticated && loggingIn) {
        return '/app';
      }
      if (!auth.isAuthenticated && !loggingIn) {
        // Wait for session restore before deciding to avoid a login flash.
        if (auth.isRestoring) return null;
        return '/login';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => HomeShell(child: child),
        routes: [
          GoRoute(
            path: '/app',
            builder: (context, state) => const DashboardScreen(),
          ),
          GoRoute(
            path: '/app/timeline',
            builder: (context, state) => const TimelineScreen(),
          ),
          GoRoute(
            path: '/app/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
    ],
  );

  ref.onDispose(goRouter.dispose);
  return goRouter;
}

final routerProvider = Provider<GoRouter>((ref) {
  return _router(ref);
});

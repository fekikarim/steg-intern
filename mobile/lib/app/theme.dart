import 'package:flutter/material.dart';

/// Central STEG brand palette (used by both the web portals and the app).
class StegColors {
  StegColors._();

  /// Primary STEG blue.
  static const Color primary = Color(0xFF0051A2);

  static const Color primaryDark = Color(0xFF003A75);

  static const Color accent = Color(0xFF00A4BD);

  static const Color background = Color(0xFFF5F7FA);

  static const Color surface = Colors.white;

  static const Color success = Color(0xFF2E7D32);

  static const Color warning = Color(0xFFF9A825);

  static const Color danger = Color(0xFFC62828);
}

/// Material 3 theme for the STEG Internship Companion.
ThemeData buildStegTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: StegColors.primary,
    primary: StegColors.primary,
    secondary: StegColors.accent,
    surface: StegColors.surface,
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: StegColors.background,
    appBarTheme: const AppBarTheme(
      backgroundColor: StegColors.primary,
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: false,
    ),
    cardTheme: const CardThemeData(
      elevation: 0,
      margin: EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(14)),
      ),
      color: Colors.white,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.black12),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.black12),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: StegColors.primary,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: Colors.white,
      indicatorColor: StegColors.primary.withValues(alpha: 0.12),
    ),
    progressIndicatorTheme:
        const ProgressIndicatorThemeData(color: StegColors.primary),
  );
}

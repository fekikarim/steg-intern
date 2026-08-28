import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/router.dart';
import 'app/theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: StegApp()));
}

class StegApp extends ConsumerWidget {
  const StegApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(
      title: 'STEG Internship Companion',
      debugShowCheckedModeBanner: false,
      theme: buildStegTheme(),
      routerConfig: router,
    );
  }
}

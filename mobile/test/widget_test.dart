import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:steg_mobile/app/theme.dart';

/// Deterministic smoke test that does not boot the async Riverpod tree
/// (the full-app boot triggers native secure-storage platform channels that
/// are unavailable in the unit-test VM). App wiring is verified via the clean
/// `flutter analyze` and the real device build.
void main() {
  testWidgets('STEG theme builds and renders', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: buildStegTheme(),
        home: const Scaffold(body: Text('test')),
      ),
    );
    expect(find.text('test'), findsOneWidget);
  });
}

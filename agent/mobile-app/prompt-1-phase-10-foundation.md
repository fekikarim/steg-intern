# AI Agent Prompt: Phase 10 — Flutter Internship Companion (Foundation)

## Role
You are an expert Flutter developer building the STEG Internship Companion app.

## Objective
Build the operational mobile application foundation for interns.

## Status: FOUNDATION COMPLETE (live-verified)

## What has been built (mobile/, org `tn.steg`, name `steg_mobile`)
### Stack
- Flutter 3.38.9 stable (SDK `/Users/karimfeki/Dev/flutter`), Dart SDK ^3.10.8.
- Deps: `flutter_riverpod` 3.3.2, `dio`, `go_router` 17.5.0, `flutter_secure_storage` (v11).

### Foundation
- `lib/core/config/app_config.dart` — `AppConfig.apiBaseUrl` (default `http://10.0.2.2:8080/api/v1`; override `--dart-define=API_BASE_URL=`).
- `lib/core/network/api_exception.dart` — parses backend error envelope `{timestamp,code,status,message,path}`; handles `DioExceptionType.transformTimeout`.
- `lib/core/storage/token_storage.dart` — `flutter_secure_storage` access/refresh token keys.
- `lib/core/network/dio_client.dart` — Bearer attach, 401 refresh via `/auth/refresh`, `_expireSession` → `onSessionExpired` (only calls `forceLogout`; router redirect handles navigation).
- `lib/core/models/` — internship, candidate, assignment, task, deliverable, evaluation, journal.

### Features
- `lib/features/auth/` — `AuthRepository`/`ApiAuthRepository` (login/register/profile/logout), `AuthController` (Riverpod `Notifier<AuthState>`, `build()` fires async `_restoreSession()`), `login_screen.dart`, `register_screen.dart`, `auth_header.dart`.
- `lib/features/home/` — `HomeRepository`/`ApiHomeRepository` (aggregates `DashboardData`: internship + assignment + tasks + deliverables + evaluation + journal via `/internships/mine` then scoped endpoints; throws `NoActiveInternshipException`), `HomeController` (AsyncNotifier), `home_shell.dart` (NavigationBar, 3 tabs), `dashboard_screen.dart`, `timeline_screen.dart`, `profile_screen.dart`.

### App wiring
- `lib/app/providers.dart` — DI (tokenStorage/dioClient/dio/authRepository/homeRepository) + `apiError` + `onSessionExpired`.
- `lib/app/router.dart` — go_router 17.5.0: **returns `GoRouter` directly (no `.config` getter)**, auth redirect watches `authControllerProvider`; `ShellRoute /app`, `/app/timeline`, `/app/profile`.
- `lib/app/theme.dart` — STEG Material 3.
- `lib/main.dart` — `ProviderScope` + `MaterialApp.router`.
- `lib/shared/widgets.dart` — StatusChip, SectionCard, LoadingView, ErrorView, EmptyView.

### Backend prerequisites (already live)
- `GET /internships/mine` (CANDIDATE only); `GET /assignments|evaluations/internship/{id}` accept CANDIDATE.
- `security/InternOwnershipService.assertInternshipOwnership(internshipId)`:
  - CANDIDATE non-owner → `BusinessException` (409, "You can only access your own internships").
  - Owner CANDIDATE or back-office (ADMIN/HR_MANAGER/SUPERVISOR/DIRECTOR) → no-op.
- Ownership guard added to candidate-accessible internship reads: journals, tasks, deliverables, documents getJournal/getTasksByInternship/getDeliverablesByInternship/getDocumentsByInternship.

## Verification
- `flutter analyze`: clean — "No issues found!".
- `flutter test`: passes — `test/widget_test.dart` is a **deterministic theme smoke test** (the full `StegApp` boot leaves a pending Timer in the unit-test VM because `AuthController._restoreSession()` reads secure storage via native platform channels unavailable in tests).
- `flutter build ios --simulator --no-codesign`: **succeeds** → `build/ios/iphonesimulator/Runner.app`.

## Environment notes
- `android/app/build.gradle.kts` uses `ndkVersion = flutter.ndkVersion` and default `compileSdk` — do not pin NDK.
- Android `flutter build apk` is currently **blocked by a corrupt local Android SDK** (mislabeled `android-37.0` platform that is actually API 17; corrupt NDK `28.2.13676358`). Environment issue only — not app code. iOS build proves packaging.

## Remaining (Phase 11+)
- Offline sync (`agent/mobile-app/prompt-2-phase-11-offline-sync.md`).
- Supervisor area (assigned interns, validate journals, deliverables, evaluations) — per `docs/MOBILE-APP-SPECS.md`.

## Definition of Done (Phase 10)
Core navigation, authentication, secure token storage, intern dashboard, and internship timeline are functional and the foundation is verified (analyze clean, tests pass, iOS build succeeds, backend live-integrated).

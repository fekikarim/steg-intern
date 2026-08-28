import 'package:dio/dio.dart';

import '../../../core/models/assignment.dart';
import '../../../core/models/deliverable.dart';
import '../../../core/models/evaluation.dart';
import '../../../core/models/internship.dart';
import '../../../core/models/journal.dart';
import '../../../core/models/task.dart';

/// Aggregate payload backing the intern dashboard.
class DashboardData {
  const DashboardData({
    this.internship,
    this.assignment,
    this.tasks = const [],
    this.deliverables = const [],
    this.evaluation,
    this.journal,
    this.hasJournal = true,
  });

  final Internship? internship;
  final Assignment? assignment;
  final List<Task> tasks;
  final List<Deliverable> deliverables;
  final Evaluation? evaluation;
  final Journal? journal;

  /// Whether the backend had a journal for this internship (404 => none yet).
  final bool hasJournal;

  int get completedTasks => tasks.where((t) => t.status == TaskStatus.completed).length;

  double get taskCompletion =>
      tasks.isEmpty ? 0 : completedTasks / tasks.length;

  bool get hasAssignment => assignment != null && assignment!.supervisorName != null;
}

/// Abstraction for fetching intern-scoped resources.
abstract interface class HomeRepository {
  Future<List<Internship>> fetchMyInternships();

  Future<Assignment?> fetchAssignment(String internshipId);

  Future<List<Task>> fetchTasks(String internshipId);

  Future<List<Deliverable>> fetchDeliverables(String internshipId);

  Future<Evaluation?> fetchEvaluation(String internshipId);

  Future<Journal?> fetchJournal(String internshipId);

  Future<DashboardData> fetchDashboard();
}

class ApiHomeRepository implements HomeRepository {
  ApiHomeRepository(this._dio) {
    _byInternship = {
      '/assignments': (Map<String, dynamic> j) => Assignment.fromJson(j),
      '/tasks': (Map<String, dynamic> j) => Task.fromJson(j),
      '/deliverables': (Map<String, dynamic> j) => Deliverable.fromJson(j),
      '/evaluations': (Map<String, dynamic> j) => Evaluation.fromJson(j),
    };
  }

  final Dio _dio;
  late final Map<String, Object Function(Map<String, dynamic>)> _byInternship;

  Future<String> _activeInternshipId() async {
    final internships = await fetchMyInternships();
    if (internships.isEmpty) {
      throw const NoActiveInternshipException();
    }
    return internships.first.id;
  }

  @override
  Future<List<Internship>> fetchMyInternships() async {
    final resp = await _dio.get<List<dynamic>>('/internships/mine');
    return (resp.data ?? [])
        .whereType<Map<String, dynamic>>()
        .map(Internship.fromJson)
        .toList();
  }

  Future<List<T>> _fetchInternshipScoped<T extends Object>(
    String internshipId,
    String path,
  ) async {
    final resp = await _dio.get<List<dynamic>>('$path/internship/$internshipId');
    final fn = _byInternship[path]!;
    return (resp.data ?? [])
        .whereType<Map<String, dynamic>>()
        .map((j) => fn(j) as T)
        .toList();
  }

  @override
  Future<Assignment?> fetchAssignment(String internshipId) async {
    final list =
        await _fetchInternshipScoped<Assignment>(internshipId, '/assignments');
    return list.isEmpty ? null : list.first;
  }

  @override
  Future<List<Task>> fetchTasks(String internshipId) =>
      _fetchInternshipScoped<Task>(internshipId, '/tasks');

  @override
  Future<List<Deliverable>> fetchDeliverables(String internshipId) =>
      _fetchInternshipScoped<Deliverable>(internshipId, '/deliverables');

  @override
  Future<Evaluation?> fetchEvaluation(String internshipId) async {
    final list =
        await _fetchInternshipScoped<Evaluation>(internshipId, '/evaluations');
    return list.isEmpty ? null : list.last;
  }

  @override
  Future<Journal?> fetchJournal(String internshipId) async {
    try {
      final resp = await _dio.get<Map<String, dynamic>>(
        '/journals/internship/$internshipId',
      );
      return Journal.fromJson(resp.data!);
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) return null;
      rethrow;
    }
  }

  @override
  Future<DashboardData> fetchDashboard() async {
    final internshipId = await _activeInternshipId();
    final internship = (await fetchMyInternships())
        .where((i) => i.id == internshipId)
        .firstOrNull;

    final results = await Future.wait([
      fetchAssignment(internshipId),
      fetchTasks(internshipId),
      fetchDeliverables(internshipId),
      fetchEvaluation(internshipId),
      fetchJournal(internshipId),
    ]);

    return DashboardData(
      internship: internship,
      assignment: results[0] as Assignment?,
      tasks: results[1] as List<Task>,
      deliverables: results[2] as List<Deliverable>,
      evaluation: results[3] as Evaluation?,
      journal: results[4] as Journal?,
      hasJournal: results[4] != null,
    );
  }
}

/// Thrown when the current candidate has no internship yet.
class NoActiveInternshipException implements Exception {
  const NoActiveInternshipException();
}

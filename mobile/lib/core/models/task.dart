/// Backend `TaskStatus` enum values.
enum TaskStatus { todo, inProgress, completed, cancelled }

TaskStatus taskStatusFromJson(String? value) => TaskStatus.values.firstWhere(
      (e) => e.name == _snake(value ?? ''),
      orElse: () => TaskStatus.todo,
);

String _snake(String value) {
  // "IN_PROGRESS" -> "inProgress"
  final parts = value.toLowerCase().split('_');
  return parts.first +
      parts.skip(1).map((p) => p[0].toUpperCase() + p.substring(1)).join();
}

/// Backend `TaskResponse` from `/tasks/internship/{id}`.
class Task {
  const Task({
    required this.id,
    required this.title,
    this.description,
    required this.status,
    this.dueDate,
    this.internshipId,
  });

  final String id;
  final String title;
  final String? description;
  final TaskStatus status;
  final DateTime? dueDate;
  final String? internshipId;

  factory Task.fromJson(Map<String, dynamic> json) => Task(
        id: json['id'] as String,
        title: json['title'] as String? ?? '',
        description: json['description'] as String?,
        status: taskStatusFromJson(json['status'] as String?),
        dueDate: json['dueDate'] != null
            ? DateTime.parse(json['dueDate'] as String)
            : null,
        internshipId: json['internshipId'] as String?,
      );
}

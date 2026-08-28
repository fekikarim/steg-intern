/// Backend `AssignmentResponse` — links an internship to a department +
/// supervisor (which the dashboard displays).
class Assignment {
  const Assignment({
    required this.id,
    this.assignmentDate,
    required this.status,
    this.internshipId,
    this.internshipReference,
    this.departmentId,
    this.departmentName,
    this.supervisorId,
    this.supervisorName,
    this.assignedById,
    this.assignedByName,
  });

  final String id;
  final DateTime? assignmentDate;
  final String status;
  final String? internshipId;
  final String? internshipReference;
  final String? departmentId;
  final String? departmentName;
  final String? supervisorId;
  final String? supervisorName;
  final String? assignedById;
  final String? assignedByName;

  factory Assignment.fromJson(Map<String, dynamic> json) => Assignment(
        id: json['id'] as String,
        assignmentDate: json['assignmentDate'] != null
            ? DateTime.parse(json['assignmentDate'] as String)
            : null,
        status: json['status'] as String? ?? '',
        internshipId: json['internshipId'] as String?,
        internshipReference: json['internshipReference'] as String?,
        departmentId: json['departmentId'] as String?,
        departmentName: json['departmentName'] as String?,
        supervisorId: json['supervisorId'] as String?,
        supervisorName: json['supervisorName'] as String?,
        assignedById: json['assignedById'] as String?,
        assignedByName: json['assignedByName'] as String?,
      );
}

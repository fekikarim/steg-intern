/// Backend `InternshipStatus` enum values.
enum InternshipStatus { planned, active, completed, cancelled, archived }

InternshipStatus internshipStatusFromJson(String? value) =>
    InternshipStatus.values.firstWhere(
      (e) => e.name.toUpperCase() == (value ?? ''),
      orElse: () => InternshipStatus.planned,
    );

/// Backend `InternshipResponse` (plural from `/internships/mine`).
class Internship {
  const Internship({
    required this.id,
    required this.reference,
    required this.startDate,
    required this.endDate,
    required this.status,
    required this.candidateId,
    this.candidateName,
  });

  final String id;
  final String reference;
  final DateTime startDate;
  final DateTime endDate;
  final InternshipStatus status;
  final String candidateId;
  final String? candidateName;

  factory Internship.fromJson(Map<String, dynamic> json) => Internship(
        id: json['id'] as String,
        reference: json['reference'] as String? ?? '',
        startDate: DateTime.parse(json['startDate'] as String),
        endDate: DateTime.parse(json['endDate'] as String),
        status: internshipStatusFromJson(json['status'] as String?),
        candidateId: json['candidateId'] as String? ?? '',
        candidateName: json['candidateName'] as String?,
      );

  /// Whole-days progress ratio in [0, 1] against the internship period.
  double get progressRatio {
    final total = endDate.difference(startDate).inDays;
    if (total <= 0) return 0;
    final elapsed = DateTime.now().difference(startDate).inDays;
    final clamped = elapsed.clamp(0, total);
    return clamped / total;
  }
}

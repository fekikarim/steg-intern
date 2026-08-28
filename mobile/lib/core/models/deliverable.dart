/// Backend `DeliverableResponse` from `/deliverables/internship/{id}`.
class Deliverable {
  const Deliverable({
    required this.id,
    required this.title,
    this.description,
    required this.status,
    this.storageKey,
    this.mimeType,
    this.size,
    this.version,
    this.submittedDate,
    this.internshipId,
    this.submittedById,
    this.submittedByName,
  });

  final String id;
  final String title;
  final String? description;
  final String status;
  final String? storageKey;
  final String? mimeType;
  final int? size;
  final int? version;
  final DateTime? submittedDate;
  final String? internshipId;
  final String? submittedById;
  final String? submittedByName;

  factory Deliverable.fromJson(Map<String, dynamic> json) => Deliverable(
        id: json['id'] as String,
        title: json['title'] as String? ?? '',
        description: json['description'] as String?,
        status: json['status'] as String? ?? '',
        storageKey: json['storageKey'] as String?,
        mimeType: json['mimeType'] as String?,
        size: (json['size'] as num?)?.toInt(),
        version: (json['version'] as num?)?.toInt(),
        submittedDate: json['submittedDate'] != null
            ? DateTime.parse(json['submittedDate'] as String)
            : null,
        internshipId: json['internshipId'] as String?,
        submittedById: json['submittedById'] as String?,
        submittedByName: json['submittedByName'] as String?,
      );

  bool get isSubmitted => status.toUpperCase() == 'SUBMITTED';
  bool get isValidated => status.toUpperCase() == 'VALIDATED';
}

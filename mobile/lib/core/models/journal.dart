/// Backend `InternshipJournal` envelope. A journal may not exist yet for an
/// internship (the backend answers 404 until one is created) — the dashboard
/// treats that as "no journal".
class Journal {
  const Journal({
    required this.id,
    this.createdDate,
    this.internshipId,
    this.entries = const [],
  });

  final String id;
  final DateTime? createdDate;
  final String? internshipId;
  final List<JournalEntry> entries;

  factory Journal.fromJson(Map<String, dynamic> json) => Journal(
        id: json['id'] as String,
        createdDate: json['createdDate'] != null
            ? DateTime.parse(json['createdDate'] as String)
            : null,
        internshipId: json['internshipId'] as String?,
        entries: (json['entries'] as List<dynamic>? ?? [])
            .whereType<Map<String, dynamic>>()
            .map(JournalEntry.fromJson)
            .toList(),
      );
}

class JournalEntry {
  const JournalEntry({
    required this.id,
    this.title,
    this.description,
    this.status,
    this.entryDate,
  });

  final String id;
  final String? title;
  final String? description;
  final String? status;
  final DateTime? entryDate;

  factory JournalEntry.fromJson(Map<String, dynamic> json) => JournalEntry(
        id: json['id'] as String,
        title: json['title'] as String?,
        description: json['description'] as String?,
        status: json['status'] as String?,
        entryDate: json['entryDate'] != null
            ? DateTime.parse(json['entryDate'] as String)
            : null,
      );
}

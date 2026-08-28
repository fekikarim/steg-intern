/// Backend `EvaluationResponse` from `/evaluations/internship/{id}` — these
/// become the milestone events on the internship timeline.
class Evaluation {
  const Evaluation({
    required this.id,
    required this.type,
    this.evaluationDate,
    this.feedback,
    this.internshipId,
    this.evaluatorId,
    this.evaluatorName,
    this.scores = const [],
  });

  final String id;
  final String type;
  final DateTime? evaluationDate;
  final String? feedback;
  final String? internshipId;
  final String? evaluatorId;
  final String? evaluatorName;
  final List<EvaluationScore> scores;

  factory Evaluation.fromJson(Map<String, dynamic> json) => Evaluation(
        id: json['id'] as String,
        type: json['type'] as String? ?? '',
        evaluationDate: json['evaluationDate'] != null
            ? DateTime.parse(json['evaluationDate'] as String)
            : null,
        feedback: json['feedback'] as String?,
        internshipId: json['internshipId'] as String?,
        evaluatorId: json['evaluatorId'] as String?,
        evaluatorName: json['evaluatorName'] as String?,
        scores: (json['scores'] as List<dynamic>? ?? [])
            .whereType<Map<String, dynamic>>()
            .map(EvaluationScore.fromJson)
            .toList(),
      );
}

class EvaluationScore {
  const EvaluationScore({this.criterion, this.score, this.maxScore});

  final String? criterion;
  final num? score;
  final num? maxScore;

  factory EvaluationScore.fromJson(Map<String, dynamic> json) =>
      EvaluationScore(
        criterion: json['criterion'] as String?,
        score: (json['score'] as num?)?.toDouble(),
        maxScore: (json['maxScore'] as num?)?.toDouble(),
      );
}

/// Backend `CandidateResponse` from `/candidates/me`.
class CandidateProfile {
  const CandidateProfile({
    required this.id,
    this.nationalId,
    this.firstName,
    this.lastName,
    this.contactEmail,
    this.phone,
    this.university,
    this.speciality,
    this.userId,
  });

  final String id;
  final String? nationalId;
  final String? firstName;
  final String? lastName;
  final String? contactEmail;
  final String? phone;
  final String? university;
  final String? speciality;
  final String? userId;

  factory CandidateProfile.fromJson(Map<String, dynamic> json) =>
      CandidateProfile(
        id: json['id'] as String,
        nationalId: json['nationalId'] as String?,
        firstName: json['firstName'] as String?,
        lastName: json['lastName'] as String?,
        contactEmail: json['contactEmail'] as String?,
        phone: json['phone'] as String?,
        university: json['university'] as String?,
        speciality: json['speciality'] as String?,
        userId: json['userId'] as String?,
      );

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();
}

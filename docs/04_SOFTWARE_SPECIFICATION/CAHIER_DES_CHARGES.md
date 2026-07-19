# Cahier des Charges

## Conception et Développement d'une Plateforme Intelligente de Gestion des Stagiaires et des Flux Administratifs de la STEG

---

## 1. Informations Générales du Projet

| Élément | Description |
|---|---|
| Entreprise d'accueil | Société Tunisienne de l'Électricité et du Gaz (STEG) |
| Type de projet | Projet de Stage d'Ingénieur |
| Stagiaires | Karim Feki & Nesrine Derouiche |
| Période | Juillet - Août 2026 |
| Domaine | Digitalisation des processus administratifs |
| Architecture cible | Plateforme distribuée multi-client avec backend centralisé |

---

# 2. Présentation de la STEG

La Société Tunisienne de l'Électricité et du Gaz (STEG) est un établissement public tunisien chargé de la production, du transport et de la distribution de l'électricité et du gaz sur l'ensemble du territoire tunisien.

Dans le cadre de sa transformation numérique, la STEG vise à moderniser ses processus internes afin :

- d'améliorer l'efficacité administrative ;
- de réduire les délais de traitement ;
- d'améliorer la traçabilité des opérations ;
- de limiter l'utilisation des documents papier ;
- de centraliser les informations métiers.

Le présent projet s'inscrit dans cette démarche en proposant une plateforme intelligente permettant de digitaliser la gestion complète des stagiaires ainsi que les différents flux administratifs associés.

---

# 3. Contexte et Problématique

## 3.1 Situation actuelle

La gestion des stages au sein de la STEG repose actuellement sur plusieurs procédures administratives impliquant différents services :

- réception des demandes de stage ;
- étude et validation des candidatures ;
- affectation aux directions/services ;
- désignation des encadrants ;
- suivi administratif ;
- génération des documents ;
- traitement des indemnités.

Ces processus nécessitent encore plusieurs échanges manuels de documents entre les différents intervenants.

---

## 3.2 Problèmes identifiés

L'analyse du fonctionnement actuel a permis d'identifier plusieurs limites :

- Utilisation importante des documents papier.
- Multiplication des validations manuelles.
- Difficulté de suivi de l'état d'avancement des dossiers.
- Absence d'une vision centralisée du cycle de vie du stage.
- Manque de traçabilité complète des opérations.
- Risque de perte ou retard des documents.
- Charge administrative importante pour les responsables.
- Communication limitée entre stagiaires et encadrants.

Malgré l'existence de plusieurs applications internes comme :

- SIGA ;
- AMIN ;
- Gestion des Stocks ;
- autres logiciels métiers ;

aucune solution ne centralise aujourd'hui l'ensemble du processus de gestion des stagiaires.

---

# 4. Objectifs du Projet

## 4.1 Objectif Général

Concevoir et développer une plateforme numérique sécurisée permettant de digitaliser la gestion des stagiaires et d'optimiser les flux administratifs associés au sein de la STEG.

---

## 4.2 Objectifs Spécifiques

La plateforme devra permettre de :

- Centraliser toutes les informations relatives aux stagiaires.
- Digitaliser les demandes de stage.
- Réduire l'utilisation des documents papier.
- Automatiser les workflows administratifs.
- Faciliter la communication entre les acteurs.
- Garantir une traçabilité complète des opérations.
- Automatiser la génération des documents administratifs.
- Fournir des tableaux de bord décisionnels.
- Accompagner les stagiaires pendant toute la durée du stage.
- Concevoir une architecture évolutive permettant l'ajout futur d'autres processus administratifs.

---

# 5. Solution Proposée

## 5.1 Vision Générale

La solution consiste en une plateforme numérique composée de trois applications clientes partageant un backend sécurisé commun.

Chaque application répond à un besoin spécifique :

            Flutter Mobile App
          (Internship Companion)

                   |
                   |

Next.js Front Office ---- Spring Boot REST API ---- PostgreSQL

                   |

Angular Back Office


---

# 6. Architecture Fonctionnelle

## 6.1 Front Office - Application Web Next.js

### Utilisateurs concernés

- Candidats / étudiants.

### Objectif

Permettre aux étudiants de gérer leur parcours de candidature avant le début du stage.

### Fonctionnalités principales

- Consultation des informations relatives aux stages.
- Création d'un compte candidat.
- Dépôt d'une demande de stage en ligne.
- Téléversement des documents nécessaires.
- Suivi du statut de candidature.
- Réception des notifications.
- Consultation et téléchargement des documents administratifs.

Les candidatures reçues physiquement pourront également être saisies manuellement par les responsables STEG depuis le Back Office.

---

# 6.2 Back Office - Application Angular

### Utilisateurs concernés

- Responsable RH.
- Responsable financier.
- Directeur.
- Administrateur.

### Objectif

Fournir un espace interne complet de gestion administrative.

### Fonctionnalités principales

## Gestion des stagiaires

- Création et modification des dossiers stagiaires.
- Consultation de l'historique.
- Suivi du cycle de stage.

## Gestion des candidatures

- Consultation des demandes.
- Validation ou rejet.
- Affectation des stagiaires.

## Gestion organisationnelle

- Gestion des départements.
- Gestion des encadrants.
- Gestion des utilisateurs.

## Workflow administratif

- Validation multi-étapes.
- Suivi des actions.
- Historique complet.

## Gestion documentaire

- Stockage sécurisé.
- Génération automatique des documents.
- Gestion des versions.

## Gestion financière

- Gestion des indemnités.
- Validation des paiements.

## Reporting

- Statistiques.
- Tableaux de bord.
- Rapports administratifs.

---

# 6.3 Application Mobile - Internship Companion

## Utilisateurs concernés

- Stagiaires.
- Encadrants.

## Objectif

Accompagner le déroulement quotidien du stage.

---

## Fonctionnalités pour le stagiaire

- Authentification sécurisée.
- Consultation du planning.
- Journal de stage quotidien/hebdomadaire.
- Gestion des tâches.
- Dépôt des livrables.
- Upload de documents/photos.
- Consultation des commentaires.
- Notifications.
- Suivi de progression.
- Consultation des documents administratifs.

---

## Fonctionnalités pour l'encadrant

- Consultation des stagiaires affectés.
- Validation des journaux.
- Commentaires sur les travaux.
- Validation des livrables.
- Suivi de progression.
- Évaluation des stagiaires.

---

# 7. Acteurs du Système

| Acteur | Responsabilités |
|---|---|
| Candidat / Étudiant | Déposer et suivre une demande de stage |
| Stagiaire | Suivre son stage et fournir les livrables |
| Encadrant | Suivi, validation et évaluation |
| Responsable RH | Gestion administrative des stages |
| Responsable Financier | Gestion des indemnités |
| Directeur | Consultation des statistiques |
| Administrateur | Administration technique |

---

# 8. Fonctionnalités Globales

## Authentification et sécurité

- Connexion sécurisée.
- Gestion des rôles.
- Gestion des permissions.
- Gestion des sessions.
- Audit des opérations.

---

## Gestion des stages

- Création d'un stage.
- Affectation.
- Suivi.
- Historique.
- Clôture.

---

## Gestion documentaire

- Upload sécurisé.
- Téléchargement.
- Versionnement.
- Génération automatique.

---

## Workflow administratif

- Création de workflows.
- Étapes de validation.
- Décisions.
- Historique.

---

## Communication

- Notifications internes.
- Notifications email.
- Notifications mobiles.

---

# 9. Exigences Non Fonctionnelles

## Sécurité

La plateforme devra garantir :

- Authentification JWT + Refresh Token.
- Gestion RBAC.
- Protection des données personnelles.
- Journalisation complète.
- Communication HTTPS.
- Contrôle d'accès.

---

## Performance

La solution devra assurer :

- Temps de réponse optimisés.
- Support de plusieurs utilisateurs simultanés.
- Optimisation des accès base de données.

---

## Fiabilité

Le système devra garantir :

- Intégrité des données.
- Sauvegardes régulières.
- Résistance aux erreurs.
- Disponibilité élevée.

---

## Ergonomie

Les interfaces devront être :

- Modernes.
- Simples.
- Intuitives.
- Adaptées aux différents profils utilisateurs.

---

## Mobilité

L'application mobile devra assurer :

- Compatibilité Android/iOS.
- Synchronisation sécurisée.
- Notifications mobiles.

---

## Évolutivité

L'architecture devra permettre :

- Ajout de nouveaux modules.
- Extension des workflows.
- Intégration future avec d'autres systèmes.

---

# 10. Technologies Utilisées

| Couche | Technologie |
|-|-|
| Front Office | Next.js |
| Back Office | Angular |
| Mobile | Flutter |
| Backend | Spring Boot 3 |
| Base de données | PostgreSQL |
| API | REST API |
| Authentification | JWT + Refresh Token |
| Autorisation | RBAC |
| Documentation API | Swagger / OpenAPI |
| Versioning | Git / GitHub |
| Modélisation | UML / Visual Paradigm / StarUML |
| Prototypage | Figma |

---

# 11. Contraintes du Projet

La solution devra respecter les contraintes suivantes :

- Respect des procédures internes STEG.
- Confidentialité des informations.
- Traçabilité complète.
- Compatibilité avec les processus existants.
- Possibilité de saisie manuelle.
- Réduction des échanges papier.
- Architecture centralisée.
- Interface accessible et moderne.

---

# 12. Perspectives d'Évolution

Grâce à son architecture modulaire, la plateforme pourra évoluer vers :

- Signature électronique.
- Authentification biométrique.
- Mode Offline First.
- OCR documentaire.
- Intelligence artificielle d'assistance.
- Génération intelligente de rapports.
- Tableaux de bord avancés.
- Gestion d'autres processus administratifs :

  - Congés.
  - Missions.
  - Achats.
  - Demandes internes.

---

# 13. Conclusion

La plateforme intelligente de gestion des stagiaires constitue une solution complète visant à accompagner la transformation numérique de la STEG.

Grâce à une architecture moderne composée d'un Front Office Next.js, d'un Back Office Angular et d'une application mobile Flutter reposant sur un backend Spring Boot centralisé, le système permettra :

- une meilleure efficacité administrative ;
- une réduction des traitements papier ;
- une meilleure communication ;
- une traçabilité complète ;
- une base technique évolutive pour les futurs besoins numériques de la STEG.

Cette solution représente une première étape vers un écosystème administratif numérique intelligent, sécurisé et extensible.
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/theme.dart';
import '../../../core/models/internship.dart';
import '../../../core/models/task.dart';
import '../../../shared/widgets.dart';
import '../data/home_repository.dart';
import 'home_controller.dart';

/// Renders the internship lifecycle as a vertical timeline: start, milestone
/// events (tasks with due dates), evaluation events, and finally the end.
class TimelineScreen extends ConsumerWidget {
  const TimelineScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(homeControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Internship Timeline')),
      body: async.when(
        loading: () => const LoadingView(message: 'Loading timeline…'),
        error: (error, st) {
          final msg = error is NoActiveInternshipException
              ? 'You do not have an internship yet.'
              : ref.read(homeControllerProvider.notifier).toApiError(error, st).message;
          return ErrorView(
            message: msg,
            onRetry: () =>
                ref.read(homeControllerProvider.notifier).refresh(),
          );
        },
        data: (data) {
          final internship = data.internship;
          if (internship == null) {
            return const EmptyView(
              icon: Icons.route_outlined,
              title: 'No timeline yet',
              subtitle: 'Your timeline will appear once you are assigned an internship.',
            );
          }
          final events = _buildEvents(data);
          return RefreshIndicator(
            onRefresh: () => ref.read(homeControllerProvider.notifier).refresh(),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                SectionCard(
                  icon: Icons.route,
                  title: internship.reference,
                  trailing: StatusChip(status: internship.status.name.toUpperCase()),
                  child: _MiniTimeline(events: events, internship: internship),
                ),
                const SizedBox(height: 6),
                const SectionCard(
                  icon: Icons.info_outline,
                  title: 'About this timeline',
                  child: Text(
                    'Events are ordered from the start to the end of your internship, '
                    'including your tasks (milestones) and evaluation checkpoints.',
                    style: TextStyle(color: Colors.black54),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  static List<_TimelineEvent> _buildEvents(DashboardData data) {
    final internship = data.internship!;
    final events = <_TimelineEvent>[];

    events.add(_TimelineEvent(
      icon: Icons.play_circle_outline,
      color: StegColors.primary,
      title: 'Internship started',
      date: internship.startDate,
    ));

    for (final task in data.tasks) {
      if (task.dueDate != null) {
        events.add(_TimelineEvent(
          icon: Icons.task_alt,
          color: task.status == TaskStatus.completed
              ? StegColors.success
              : StegColors.warning,
          title: task.title,
          subtitle: task.status.name.replaceAll('_', ' ').toLowerCase(),
          date: task.dueDate!,
        ));
      }
    }

    if (data.evaluation != null) {
      final e = data.evaluation!;
      if (e.evaluationDate != null) {
        events.add(_TimelineEvent(
          icon: Icons.fact_check_outlined,
          color: StegColors.primary,
          title: 'Evaluation · ${e.type.replaceAll('_', ' ').toLowerCase()}',
          subtitle: e.feedback,
          date: e.evaluationDate!,
        ));
      }
    }

    events.add(_TimelineEvent(
      icon: Icons.flag_circle_outlined,
      color: StegColors.success,
      title: 'Internship ends',
      date: internship.endDate,
    ));

    events.sort((a, b) => a.date.compareTo(b.date));
    return events;
  }
}

class _TimelineEvent {
  const _TimelineEvent({
    required this.icon,
    required this.color,
    required this.title,
    required this.date,
    this.subtitle,
  });

  final IconData icon;
  final Color color;
  final String title;
  final String? subtitle;
  final DateTime date;
}

class _MiniTimeline extends StatelessWidget {
  const _MiniTimeline({required this.events, required this.internship});

  final List<_TimelineEvent> events;
  final Internship internship;

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    return Column(
      children: [
        for (var i = 0; i < events.length; i++)
          _row(context, events[i], isLast: i == events.length - 1, now: now),
      ],
    );
  }

  Widget _row(BuildContext context, _TimelineEvent e,
      {required bool isLast, required DateTime now}) {
    final passed = !now.isBefore(e.date);
    final lineColor = StegColors.primary.withValues(alpha: 0.18);
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            width: 28,
            child: Column(
              children: [
                Container(
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    color: passed ? e.color : Colors.grey.shade300,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(e.icon, size: 14, color: Colors.white),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(width: 2, color: lineColor),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          e.title,
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: passed ? Colors.black87 : Colors.black45,
                          ),
                        ),
                      ),
                      Text(
                        _fmt(e.date),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                    ],
                  ),
                  if (e.subtitle != null && e.subtitle!.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        e.subtitle!,
                        style: const TextStyle(fontSize: 12, color: Colors.black54),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

String _fmt(DateTime d) =>
    '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';

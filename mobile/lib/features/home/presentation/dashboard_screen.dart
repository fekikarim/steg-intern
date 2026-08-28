import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/theme.dart';
import '../../../core/models/assignment.dart';
import '../../../core/models/internship.dart';
import '../../../core/models/task.dart';
import '../../../shared/widgets.dart';
import '../data/home_repository.dart';
import 'home_controller.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(homeControllerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Internship'),
        actions: [
          IconButton(
            tooltip: 'Refresh',
            onPressed: () => ref.read(homeControllerProvider.notifier).refresh(),
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: async.when(
        loading: () => const LoadingView(message: 'Loading your internship…'),
        error: (error, st) {
          final msg = error is NoActiveInternshipException
              ? 'You do not have an internship yet.'
              : ref.read(homeControllerProvider.notifier).toApiError(error, st).message;
          return ErrorView(
            message: msg,
            onRetry: () => ref.read(homeControllerProvider.notifier).refresh(),
          );
        },
        data: (data) {
          if (data.internship == null) {
            return const EmptyView(
              icon: Icons.assignment_turned_in_outlined,
              title: 'No internship assigned',
              subtitle: 'Once an internship is assigned to you it will appear here.',
            );
          }
          return RefreshIndicator(
            onRefresh: () => ref.read(homeControllerProvider.notifier).refresh(),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _InternshipCard(internship: data.internship!),
                const SizedBox(height: 6),
                _SupervisorCard(assignment: data.assignment),
                const SizedBox(height: 6),
                _ProgressCard(data: data),
                const SizedBox(height: 6),
                _TasksCard(data: data),
                const SizedBox(height: 6),
                _DeliverablesCard(data: data),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _InternshipCard extends StatelessWidget {
  const _InternshipCard({required this.internship});

  final Internship internship;

  @override
  Widget build(BuildContext context) {
    final ratio = internship.progressRatio;
    return SectionCard(
      icon: Icons.work_outline,
      title: internship.reference,
      trailing: StatusChip(status: internship.status.name.toUpperCase()),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _labelRow(Icons.flag_outlined, 'Start', _fmt(internship.startDate)),
          _labelRow(Icons.flag, 'End', _fmt(internship.endDate)),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: ratio,
              minHeight: 8,
              backgroundColor: StegColors.primary.withValues(alpha: 0.12),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            '${(ratio * 100).round()}% of the internship period elapsed',
            style: const TextStyle(fontSize: 12, color: Colors.black54),
          ),
        ],
      ),
    );
  }

  Widget _labelRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.black45),
          const SizedBox(width: 8),
          SizedBox(
            width: 64,
            child: Text(label, style: const TextStyle(color: Colors.black54, fontSize: 13)),
          ),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
        ],
      ),
    );
  }
}

class _SupervisorCard extends StatelessWidget {
  const _SupervisorCard({required this.assignment});

  final Assignment? assignment;

  @override
  Widget build(BuildContext context) {
    final hasAssignment = assignment != null;
    return SectionCard(
      icon: Icons.support_agent,
      title: 'Supervisor & Department',
      child: hasAssignment
          ? Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  leading: const CircleAvatar(
                    child: Icon(Icons.person),
                  ),
                  title: Text(assignment!.supervisorName ?? 'Unassigned'),
                  subtitle: const Text('Supervisor'),
                ),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  leading: const CircleAvatar(
                    child: Icon(Icons.business_outlined),
                  ),
                  title: Text(assignment!.departmentName ?? 'Unassigned'),
                  subtitle: const Text('Department'),
                ),
              ],
            )
          : const Text(
              'No assignment yet — you will be assigned a supervisor and department.',
              style: TextStyle(color: Colors.black54),
            ),
    );
  }
}

class _ProgressCard extends StatelessWidget {
  const _ProgressCard({required this.data});

  final DashboardData data;

  @override
  Widget build(BuildContext context) {
    final ratio = data.taskCompletion;
    final journal = data.hasJournal
        ? '${data.journal?.entries.length ?? 0} entries'
        : 'Not created yet';

    return SectionCard(
      icon: Icons.insights_outlined,
      title: 'Progress',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: _metric('${data.completedTasks}/${data.tasks.length}', 'Tasks done')),
              Expanded(child: _metric('${data.deliverables.length}', 'Deliverables')),
              Expanded(child: _metric(journal, 'Journal')),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: ratio,
              minHeight: 8,
              backgroundColor: StegColors.primary.withValues(alpha: 0.12),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            '${(ratio * 100).round()}% of tasks completed',
            style: const TextStyle(fontSize: 12, color: Colors.black54),
          ),
        ],
      ),
    );
  }

  Widget _metric(String value, String label) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.black54)),
      ],
    );
  }
}

class _TasksCard extends StatelessWidget {
  const _TasksCard({required this.data});

  final DashboardData data;

  @override
  Widget build(BuildContext context) {
    final open = data.tasks.where((t) => t.status != TaskStatus.completed).toList();
    return SectionCard(
      icon: Icons.checklist_outlined,
      title: 'Open Tasks',
      trailing: Text(
        '${open.length}',
        style: const TextStyle(fontWeight: FontWeight.w800, color: StegColors.primary),
      ),
      child: open.isEmpty
          ? const Text('No open tasks.', style: TextStyle(color: Colors.black54))
          : Column(
              children: open.take(5).map((t) {
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  leading: Icon(
                    t.status == TaskStatus.inProgress
                        ? Icons.timelapse
                        : Icons.radio_button_unchecked,
                    color: StegColors.primary,
                  ),
                  title: Text(t.title),
                  subtitle: t.dueDate != null
                      ? Text('Due ${_fmt(t.dueDate!)}')
                      : null,
                  trailing:
                      t.dueDate != null && t.dueDate!.isBefore(DateTime.now())
                          ? const Icon(Icons.warning_amber, color: StegColors.danger, size: 18)
                          : StatusChip(status: t.status.name.toUpperCase()),
                );
              }).toList(),
            ),
    );
  }
}

class _DeliverablesCard extends StatelessWidget {
  const _DeliverablesCard({required this.data});

  final DashboardData data;

  @override
  Widget build(BuildContext context) {
    final pending = data.deliverables
        .where((d) => !d.isValidated)
        .toList();
    return SectionCard(
      icon: Icons.inventory_2_outlined,
      title: 'Deliverables',
      child: data.deliverables.isEmpty
          ? const Text('No deliverables yet.', style: TextStyle(color: Colors.black54))
          : Column(
              children: pending.map((d) {
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  leading: Icon(
                    d.isSubmitted ? Icons.hourglass_top : Icons.description_outlined,
                    color: StegColors.warning,
                  ),
                  title: Text(d.title),
                  trailing: StatusChip(status: d.status),
                );
              }).toList(),
            ),
    );
  }
}

String _fmt(DateTime d) =>
    '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';

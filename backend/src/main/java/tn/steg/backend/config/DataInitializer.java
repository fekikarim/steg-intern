package tn.steg.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.departments.entity.Administrator;
import tn.steg.backend.departments.entity.Department;
import tn.steg.backend.departments.entity.Employee;
import tn.steg.backend.departments.repository.DepartmentRepository;
import tn.steg.backend.departments.repository.EmployeeRepository;
import tn.steg.backend.users.entity.Permission;
import tn.steg.backend.users.entity.Role;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.entity.UserStatus;
import tn.steg.backend.users.repository.PermissionRepository;
import tn.steg.backend.users.repository.RoleRepository;
import tn.steg.backend.users.repository.UserRepository;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            log.info("Database already seeded — skipping DataInitializer");
            return;
        }

        log.info("Seeding initial data...");
        seedPermissions();
        seedRoles();
        seedDepartments();
        seedAdminUser();
        log.info("DataInitializer complete.");
    }

    private void seedPermissions() {
        String[][] perms = {
            {"USER_CREATE", "Create users"},
            {"USER_READ", "View users"},
            {"USER_UPDATE", "Update users"},
            {"USER_DELETE", "Delete users"},
            {"ROLE_CREATE", "Create roles"},
            {"ROLE_READ", "View roles"},
            {"ROLE_UPDATE", "Update roles"},
            {"ROLE_DELETE", "Delete roles"},
            {"CANDIDATE_CREATE", "Create candidates"},
            {"CANDIDATE_READ", "View candidates"},
            {"CANDIDATE_UPDATE", "Update candidates"},
            {"CANDIDATE_DELETE", "Delete candidates"},
            {"APPLICATION_CREATE", "Create applications"},
            {"APPLICATION_READ", "View applications"},
            {"APPLICATION_UPDATE", "Update applications"},
            {"APPLICATION_DELETE", "Delete applications"},
            {"APPLICATION_APPROVE", "Approve/reject applications"},
            {"INTERNSHIP_CREATE", "Create internships"},
            {"INTERNSHIP_READ", "View internships"},
            {"INTERNSHIP_UPDATE", "Update internships"},
            {"INTERNSHIP_DELETE", "Delete internships"},
            {"ASSIGNMENT_CREATE", "Create assignments"},
            {"ASSIGNMENT_READ", "View assignments"},
            {"ASSIGNMENT_UPDATE", "Update assignments"},
            {"WORKFLOW_READ", "View workflows"},
            {"WORKFLOW_APPROVE", "Approve workflow steps"},
            {"DOCUMENT_UPLOAD", "Upload documents"},
            {"DOCUMENT_DOWNLOAD", "Download documents"},
            {"DOCUMENT_DELETE", "Delete documents"},
            {"DOCUMENT_GENERATE", "Generate official documents"},
            {"PAYMENT_READ", "View payments"},
            {"PAYMENT_CREATE", "Create payments"},
            {"PAYMENT_VALIDATE", "Validate payments"},
            {"PAYMENT_PAY", "Mark payments as paid"},
            {"REPORT_READ", "View reports"},
            {"REPORT_EXPORT", "Export reports"},
            {"NOTIFICATION_SEND", "Send notifications"},
            {"NOTIFICATION_READ", "View notifications"},
            {"SETTINGS_MANAGE", "Manage platform settings"},
        };

        for (String[] p : perms) {
            Permission perm = Permission.builder().code(p[0]).description(p[1]).build();
            permissionRepository.save(perm);
        }
        log.info("Seeded {} permissions", perms.length);
    }

    private void seedRoles() {
        var allPermissions = permissionRepository.findAll();
        Map<String, Permission> permMap = allPermissions.stream()
                .collect(Collectors.toMap(Permission::getCode, p -> p));

        Role adminRole = Role.builder()
                .name("ADMINISTRATOR")
                .description("Full platform access")
                .permissions(Set.copyOf(allPermissions))
                .build();
        roleRepository.save(adminRole);

        Role hrRole = Role.builder()
                .name("HR_MANAGER")
                .description("Human resources management")
                .permissions(Set.of(
                    permMap.get("CANDIDATE_READ"), permMap.get("CANDIDATE_CREATE"), permMap.get("CANDIDATE_UPDATE"),
                    permMap.get("APPLICATION_READ"), permMap.get("APPLICATION_CREATE"), permMap.get("APPLICATION_UPDATE"),
                    permMap.get("APPLICATION_APPROVE"),
                    permMap.get("INTERNSHIP_READ"), permMap.get("INTERNSHIP_CREATE"), permMap.get("INTERNSHIP_UPDATE"),
                    permMap.get("ASSIGNMENT_READ"), permMap.get("ASSIGNMENT_CREATE"), permMap.get("ASSIGNMENT_UPDATE"),
                    permMap.get("DOCUMENT_UPLOAD"), permMap.get("DOCUMENT_DOWNLOAD"), permMap.get("DOCUMENT_GENERATE"),
                    permMap.get("NOTIFICATION_READ"), permMap.get("NOTIFICATION_SEND")
                ))
                .build();
        roleRepository.save(hrRole);

        Role supervisorRole = Role.builder()
                .name("SUPERVISOR")
                .description("Internship supervision")
                .permissions(Set.of(
                    permMap.get("INTERNSHIP_READ"), permMap.get("ASSIGNMENT_READ"),
                    permMap.get("WORKFLOW_READ"), permMap.get("WORKFLOW_APPROVE"),
                    permMap.get("DOCUMENT_UPLOAD"), permMap.get("DOCUMENT_DOWNLOAD"),
                    permMap.get("NOTIFICATION_READ")
                ))
                .build();
        roleRepository.save(supervisorRole);

        Role financeRole = Role.builder()
                .name("FINANCE_MANAGER")
                .description("Financial management")
                .permissions(Set.of(
                    permMap.get("PAYMENT_READ"), permMap.get("PAYMENT_CREATE"), permMap.get("PAYMENT_VALIDATE"), permMap.get("PAYMENT_PAY"),
                    permMap.get("REPORT_READ"), permMap.get("REPORT_EXPORT"),
                    permMap.get("NOTIFICATION_READ")
                ))
                .build();
        roleRepository.save(financeRole);

        Role directorRole = Role.builder()
                .name("DIRECTOR")
                .description("Executive oversight")
                .permissions(Set.of(
                    permMap.get("REPORT_READ"), permMap.get("REPORT_EXPORT"),
                    permMap.get("INTERNSHIP_READ"), permMap.get("PAYMENT_READ"),
                    permMap.get("NOTIFICATION_READ")
                ))
                .build();
        roleRepository.save(directorRole);

        Role candidateRole = Role.builder()
                .name("CANDIDATE")
                .description("Internship applicant")
                .permissions(Set.of(
                    permMap.get("APPLICATION_CREATE"), permMap.get("APPLICATION_READ"),
                    permMap.get("DOCUMENT_UPLOAD"), permMap.get("DOCUMENT_DOWNLOAD"),
                    permMap.get("NOTIFICATION_READ")
                ))
                .build();
        roleRepository.save(candidateRole);

        log.info("Seeded 6 roles");
    }

    private void seedDepartments() {
        Department root = Department.builder()
                .code("STEG-HQ")
                .name("Headquarters")
                .description("STEG General Directorate")
                .build();
        departmentRepository.save(root);

        Department hr = Department.builder()
                .code("HR-DEPT")
                .name("Human Resources")
                .description("Human Resources Department")
                .parent(root)
                .build();
        departmentRepository.save(hr);

        Department finance = Department.builder()
                .code("FIN-DEPT")
                .name("Finance")
                .description("Finance Department")
                .parent(root)
                .build();
        departmentRepository.save(finance);

        Department it = Department.builder()
                .code("IT-DEPT")
                .name("Information Technology")
                .description("IT Department")
                .parent(root)
                .build();
        departmentRepository.save(it);

        log.info("Seeded 4 departments");
    }

    private void seedAdminUser() {
        Role adminRole = roleRepository.findByName("ADMINISTRATOR")
                .orElseThrow(() -> new RuntimeException("Admin role not found — seeding failed"));

        Department hrDept = departmentRepository.findByCode("HR-DEPT")
                .orElseThrow(() -> new RuntimeException("HR department not found — seeding failed"));

        User adminUser = User.builder()
                .email("admin@steg.tn")
                .passwordHash(passwordEncoder.encode("Admin@123456"))
                .enabled(true)
                .status(UserStatus.ACTIVE)
                .role(adminRole)
                .build();
        userRepository.save(adminUser);

        Administrator adminProfile = new Administrator();
        adminProfile.setUser(adminUser);
        adminProfile.setFirstName("System");
        adminProfile.setLastName("Administrator");
        adminProfile.setEmployeeNumber("ADM-001");
        adminProfile.setHireDate(LocalDate.now());
        adminProfile.setDepartment(hrDept);
        employeeRepository.save(adminProfile);

        log.info("Seeded admin user: admin@steg.tn / Admin@123456");
    }
}

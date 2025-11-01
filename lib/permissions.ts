// In your business logic, not schema:
const ROLE_DEFAULT_PERMISSIONS = {
  OWNER: ['*'], // All permissions
  ADMIN: ['member.invite', 'member.remove', 'settings.update'],
  TEACHER: ['student.view', 'attendance.mark'],
  STUDENT: ['attendance.view', 'grade.view'],
};

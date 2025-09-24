import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Make sure that the `/api/webhooks/(.*)` route is not protected here

/* ───────────────────────── 1. Route groups ────────────────────────── */
// Each matcher covers one “role island”.
const isStudent = createRouteMatcher([
  '/dashboard/fees/student(.*)',
  '/dashboard/assignments(.*)',
  '/dashboard/my-attendance(.*)',
  '/dashboard/documents',
  // Add other student routes here
]);

const isParent = createRouteMatcher([
  '/dashboard/fees/parent(.*)',
  '/dashboard/my-children(.*)',
  '/dashboard/child-attendance(.*)',
  // Add other parent routes here
]);

const isTeacher = createRouteMatcher([
  '/dashboard/fees/teacher(.*)',
  // '/dashboard/fees/admin/assign',
  // '/dashboard/attendance/mark(.*)',
  // '/dashboard/grades(.*)',
  // '/dashboard/holidays(.*)',
  // Add other teacher routes here
]);

const isAdmin = createRouteMatcher([
  '/dashboard/fees/admin(.*)',
  // '/dashboard/admin(.*)',
  // '/dashboard/grades(.*)',
  // '/dashboard/holidays(.*)',
  // '/dashboard/documents/verification(.*)',

  // '/dashboard/notices/create'
  // Add any other admin routes here
]);

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  if (isStudent(req)) await auth.protect({ role: 'student' }); // 404 if wrong role
  if (isParent(req)) await auth.protect({ role: 'parent' });
  if (isTeacher(req)) await auth.protect({ role: 'teacher' });
  if (isAdmin(req)) await auth.protect({ role: 'admin' });
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
};

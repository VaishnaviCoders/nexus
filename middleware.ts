import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Make sure that the `/api/webhooks/(.*)` route is not protected here

const isPublicRoute = createRouteMatcher([
  '/',
  '/blog(.*)',
  '/features(.*)',
  '/founder',
  '/why-shiksha',
  '/why-us',
  '/support',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isSelectOrgRoute = createRouteMatcher(['/select-organization(.*)']);

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
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

  '/dashboard/notices/create',
  '/dashboard/teachers',

  // Add any other admin routes here
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId, orgRole } = await auth();

  // If user is authenticated but has no organization and trying to access protected routes
  if (userId && !orgId && isProtectedRoute(req)) {
    const selectOrgUrl = new URL('/select-organization', req.url);
    selectOrgUrl.searchParams.set('returnUrl', req.url);
    return NextResponse.redirect(selectOrgUrl);
  }

  if (isProtectedRoute(req)) await auth.protect();

  if (isStudent(req)) await auth.protect({ role: 'student' }); // 404 if wrong role
  if (isParent(req)) await auth.protect({ role: 'parent' });
  if (isTeacher(req)) await auth.protect({ role: 'teacher' });
  if (isAdmin(req)) await auth.protect({ role: 'admin' });
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
};

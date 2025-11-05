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
  '/api/webhooks/(.*)',
  '/sitemap.xml(.*)',
  '/robots.txt(.*)',
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
]);

const isParent = createRouteMatcher([
  '/dashboard/fees/parent(.*)',
  '/dashboard/my-children(.*)',
  '/dashboard/child-attendance(.*)',
]);

const isTeacher = createRouteMatcher([
  '/dashboard/fees/teacher(.*)',
  // '/dashboard/fees/admin/assign',
  // '/dashboard/attendance/mark(.*)',
  // '/dashboard/grades(.*)',
  // '/dashboard/holidays(.*)',
  // '/dashboard/notices/create',
]);

const isAdmin = createRouteMatcher([
  '/dashboard/fees/admin(.*)',
  // '/dashboard/admin(.*)',
  // '/dashboard/grades(.*)',
  // '/dashboard/holidays(.*)',
  // '/dashboard/documents/verification(.*)',
  // '/dashboard/notices/create',
  '/dashboard/teachers',
]);

// Detect if request is from a search engine crawler
function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;

  const crawlers = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'sogou',
    'exabot',
    'facebot',
    'ia_archiver',
  ];

  const ua = userAgent.toLowerCase();
  return crawlers.some((crawler) => ua.includes(crawler));
}
export default clerkMiddleware(async (auth, req) => {
  const userAgent = req.headers.get('user-agent');

  // CRITICAL: Allow all crawlers on public routes WITHOUT any auth checks
  if (isPublicRoute(req)) {
    // If it's a crawler, skip ALL Clerk processing
    if (isCrawler(userAgent)) {
      return NextResponse.next();
    }
    // For regular users, also skip auth on public routes
    return NextResponse.next();
  }

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

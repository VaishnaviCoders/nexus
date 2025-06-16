import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Make sure that the `/api/webhooks/(.*)` route is not protected here

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)']);
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/api']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
};

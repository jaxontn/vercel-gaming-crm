import { NextRequest, NextResponse } from 'next/server';

// List of protected routes
const protectedRoutes = [
  '/dashboard',
  '/api/protected',
];

// List of public routes
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/play',
  '/api/auth',
  '/api/public',
];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the path is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  const token = req.cookies.get('auth_token')?.value;

  if (!token && pathname !== '/login') {
    // Redirect to login if no token and not already on login page
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && pathname === '/login') {
    // Redirect to dashboard if already logged in
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
    */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
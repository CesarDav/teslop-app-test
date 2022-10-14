import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';
// import { NextResponse } from 'next/server'
// import { jwtVerify } from "jose";


// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
    const session: any = await getToken({ req });
    // const token = request.cookies.get('token') || '';
    // try {
    //     await jwtVerify(token, new TextEncoder().encode(process.env.JWS_SCRET_SEED));
    //     return NextResponse.next();
    // } catch (error) {
    //     // url.pathname = '/'
    //     const { protocol, host, pathname } = request.nextUrl;
    //     return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`);
    // }

    if (!session) {
        if (req.nextUrl.pathname.startsWith('/api/admin')) {
            return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
        }
        const { protocol, host, pathname } = req.nextUrl;
        return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`);
    }

    const validRoles = ['admin'];

    if (req.nextUrl.pathname.startsWith('/admin')) {
        if (!validRoles.includes(session?.user.role)) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/checkout/:path*', '/admin/:path*', '/((?!api\/)/admin/:path.*)'],
}

// '/api/admin/:path*',
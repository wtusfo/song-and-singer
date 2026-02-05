import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const protectedRoutes = ['/dashboard', '/admin'];

export default async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.find(route => path.startsWith(route))

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    const response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );
    const { searchParams, origin } = request.nextUrl;
    const pathname = request.nextUrl.pathname;
    const code = searchParams.get("code");

    if (code && pathname === "/") {
        return NextResponse.redirect(`${origin}/auth/callback?code=${code}`);
    }

    const { data: { session }, error } = await supabase.auth.getSession();

    if (isProtectedRoute && (!session || error)) {
        return NextResponse.redirect(new URL('/auth/signin', request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

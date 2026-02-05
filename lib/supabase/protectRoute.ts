import { NextRequest, NextResponse } from "next/server"
import { createClient } from "./server"
import { User } from "@supabase/supabase-js"

export function protectRoute(handler: (request: NextRequest, user: User) => Promise<NextResponse>, role?: string) {
    return async function POST(request: NextRequest) {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()


        if (!user || error) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (role && user.app_metadata.role !== role) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }

        return handler(request, user)
    }
}
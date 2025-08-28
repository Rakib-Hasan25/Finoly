import { NextResponse } from 'next/server'
import { createSupabaseReqRes } from '@/lib/supabase/supabase-req-res'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createSupabaseReqRes()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
    }

    if (session?.user?.email) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      // If user doesn't exist, create new user
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ email: session.user.email }])

        if (insertError) {
          console.error('Error creating user:', insertError)
        }
      }
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}

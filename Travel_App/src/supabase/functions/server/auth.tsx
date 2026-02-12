import { createClient } from "jsr:@supabase/supabase-js@2";

// Helper function to create Supabase client with service role
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[Auth] CRITICAL: Missing Supabase environment variables!');
    console.error('[Auth] SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
    console.error('[Auth] SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING');
    throw new Error('Missing Supabase credentials');
  }

  console.log('[Auth] Creating Supabase client...');
  console.log('[Auth] URL:', supabaseUrl.substring(0, 30) + '...');
  console.log('[Auth] Service Key length:', supabaseServiceKey.length);

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

export async function signUp(email: string, password: string, name: string) {
  try {
    console.log('[Auth] Starting sign up for:', email);
    
    const supabase = getSupabaseClient();
    
    // Automatically confirm the user's email since an email server hasn't been configured.
    console.log('[Auth] Calling supabase.auth.admin.createUser...');
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.error(`[Auth] Supabase createUser error:`, error);
      return { success: false, error: error.message };
    }

    if (!data || !data.user) {
      console.error('[Auth] No user data returned from createUser');
      return { success: false, error: 'Failed to create user - no data returned' };
    }

    console.log('[Auth] User created successfully:', data.user.id);

    // Get session for the newly created user
    console.log('[Auth] Creating session for new user...');
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (sessionError) {
      console.error(`[Auth] Sign up session error:`, sessionError);
      return { success: false, error: sessionError.message };
    }

    if (!sessionData || !sessionData.session) {
      console.error('[Auth] No session returned after sign in');
      return { success: false, error: 'Failed to create session' };
    }

    console.log('[Auth] Sign up successful! User ID:', data.user.id);
    return { 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email || email,
        name: name
      },
      accessToken: sessionData.session.access_token
    };
  } catch (error) {
    console.error(`[Auth] Sign up exception:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return { success: false, error: errorMessage };
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log('[Auth] Starting sign in for:', email);
    
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(`[Auth] Sign in error: ${error.message}`, error);
      return { success: false, error: error.message };
    }

    if (!data.session) {
      console.error('[Auth] No session returned after sign in');
      return { success: false, error: 'No session created' };
    }

    console.log('[Auth] Sign in successful!');
    return { 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || email.split('@')[0]
      },
      accessToken: data.session.access_token 
    };
  } catch (error) {
    console.error(`[Auth] Sign in exception:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
    return { success: false, error: errorMessage };
  }
}

export async function signOut(accessToken: string) {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.admin.signOut(accessToken);
    
    if (error) {
      console.log(`Sign out error: ${error.message}`);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.log(`Sign out exception: ${error}`);
    return { success: false, error: 'Failed to sign out' };
  }
}

export async function verifyToken(accessToken: string) {
  try {
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return { valid: false, error: 'Unauthorized' };
    }

    return { 
      valid: true, 
      user: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User'
      }
    };
  } catch (error) {
    console.log(`Token verification error: ${error}`);
    return { valid: false, error: 'Invalid token' };
  }
}
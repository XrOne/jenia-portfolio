import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { getSessionCookieOptions } from './_core/cookies';
import { COOKIE_NAME } from '@shared/const';
import { upsertUser, getUserByOpenId } from './db';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Endpoint to sync Supabase Auth session with server session
 */
export async function syncSupabaseSession(req: Request, res: Response) {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ error: 'Missing access_token' });
    }

    // Verify the Supabase token
    const { data: { user }, error } = await supabase.auth.getUser(access_token);

    if (error || !user) {
      console.error('[Supabase Auth] Invalid token:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user from database
    let dbUser = await getUserByOpenId(user.email!);

    if (!dbUser) {
      // Create user if doesn't exist
      await upsertUser({
        openId: user.email!,
        email: user.email!,
        name: user.user_metadata?.name || 'User',
        loginMethod: 'supabase',
      });
      dbUser = await getUserByOpenId(user.email!);
    }

    if (!dbUser) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Create server session
    const sessionData = {
      openId: dbUser.openId,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      loginMethod: dbUser.loginMethod,
    };

    // Set session cookie
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, JSON.stringify(sessionData), cookieOptions);

    return res.json({
      success: true,
      user: sessionData,
    });
  } catch (error) {
    console.error('[Supabase Auth] Sync error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Middleware to check Supabase Auth token and sync session
 */
export async function supabaseAuthMiddleware(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next();
    }

    // Get user from database
    const dbUser = await getUserByOpenId(user.email!);

    if (dbUser) {
      // Attach user to request
      (req as any).user = {
        openId: dbUser.openId,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        loginMethod: dbUser.loginMethod,
      };
    }

    next();
  } catch (error) {
    console.error('[Supabase Auth] Middleware error:', error);
    next();
  }
}

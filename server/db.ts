import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './_core/env';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined');
    }

    _supabase = createClient(supabaseUrl, supabaseKey);
  }

  return _supabase;
}

// User operations
export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export interface InsertUser {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: 'user' | 'admin';
  lastSignedIn?: Date;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const supabase = getSupabase();

  try {
    const userData: any = {
      openId: user.openId,
      name: user.name ?? null,
      email: user.email ?? null,
      loginMethod: user.loginMethod ?? null,
      lastSignedIn: user.lastSignedIn ? user.lastSignedIn.toISOString() : new Date().toISOString(),
    };

    // Check if user is owner
    if (user.openId === ENV.ownerOpenId || user.role === 'admin') {
      userData.role = 'admin';
    } else if (user.role) {
      userData.role = user.role;
    }

    const { error } = await supabase
      .from('users')
      .upsert(userData, {
        onConflict: 'openId',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("[Database] Failed to upsert user:", error);
      throw error;
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('openId', openId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return undefined;
    }
    console.error("[Database] Failed to get user:", error);
    return undefined;
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    lastSignedIn: new Date(data.lastSignedIn),
  } as User;
}

// Video operations
export interface Video {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  fileKey: string;
  duration: number | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export async function getActiveVideos(): Promise<Video[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('isActive', true)
    .order('displayOrder', { ascending: false })
    .order('createdAt', { ascending: false });

  if (error) {
    console.error("[Database] Failed to get videos:", error);
    return [];
  }

  return data as Video[];
}

export async function getAllVideos(): Promise<Video[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('displayOrder', { ascending: false })
    .order('createdAt', { ascending: false });

  if (error) {
    console.error("[Database] Failed to get all videos:", error);
    return [];
  }

  return data as Video[];
}

export async function createVideo(video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>): Promise<Video> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('videos')
    .insert(video)
    .select()
    .single();

  if (error) {
    console.error("[Database] Failed to create video:", error);
    throw error;
  }

  return data as Video;
}

export async function updateVideo(id: number, updates: Partial<Omit<Video, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Video> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('videos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("[Database] Failed to update video:", error);
    throw error;
  }

  return data as Video;
}

export async function deleteVideo(id: number): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("[Database] Failed to delete video:", error);
    throw error;
  }
}

// Mission Operations
export interface Workflow {
  id: number;
  missionId: number | null;
  title: string;
  description: string | null;
  toolsUsed: string | null;
  demoUrl: string | null;
  codeSnippet: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Mission {
  id: number;
  title: string;
  clientName: string | null;
  description: string | null;
  coverImageUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  workflows?: Workflow[];
}

export async function getMissions(): Promise<Mission[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('isPublished', true)
    .order('displayOrder', { ascending: false });

  if (error) throw error;
  return data as Mission[];
}

export async function getMissionById(id: number): Promise<Mission | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('missions')
    .select('*, workflows(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Mission;
}

// Experience Operations
export interface ExperiencePost {
  id: number;
  title: string;
  summary: string | null;
  content: string | null;
  type: 'notebook' | 'video' | 'podcast' | 'article';
  mediaUrl: string | null;
  tags: string | null;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export async function getExperiencePosts(): Promise<ExperiencePost[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('experience_posts')
    .select('*')
    .eq('isPublished', true)
    .order('displayOrder', { ascending: false });

  if (error) throw error;
  return data as ExperiencePost[];
}

import { supabase } from './supabase';
import type { Profile } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile | null;
}

// Sign up with email and password
export async function signUp(email: string, password: string, displayName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split('@')[0],
      },
    },
  });

  if (error) throw error;
  return data;
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign in with Google OAuth
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/en/dashboard`,
    },
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current user session
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// Get current user with profile
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return {
    id: session.user.id,
    email: session.user.email || '',
    profile,
  };
}

// Update user profile
export async function updateProfile(updates: Partial<Profile>) {
  const session = await getSession();
  if (!session?.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', session.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update lesson progress
export async function updateLessonProgress(
  moduleNumber: number,
  lessonNumber: number,
  status: 'in_progress' | 'completed',
  timeSpent: number = 0
) {
  const session = await getSession();
  if (!session?.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert(
      {
        user_id: session.user.id,
        module_number: moduleNumber,
        lesson_number: lessonNumber,
        status,
        time_spent_seconds: timeSpent,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      },
      { onConflict: 'user_id,module_number,lesson_number' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Save quiz score
export async function saveQuizScore(
  moduleNumber: number,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  timeTaken: number
) {
  const session = await getSession();
  if (!session?.user) throw new Error('Not authenticated');

  // Get attempt number
  const { count } = await supabase
    .from('quiz_scores')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id)
    .eq('module_number', moduleNumber);

  const { data, error } = await supabase
    .from('quiz_scores')
    .insert({
      user_id: session.user.id,
      module_number: moduleNumber,
      score,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      time_taken_seconds: timeTaken,
      attempt_number: (count || 0) + 1,
    })
    .select()
    .single();

  if (error) throw error;

  // Update points
  const points = correctAnswers * 10;
  await supabase.rpc('increment_points', {
    p_user_id: session.user.id,
    p_points: points,
  });

  return data;
}

// Get user's lesson progress
export async function getLessonProgress() {
  const session = await getSession();
  if (!session?.user) return [];

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .order('module_number', { ascending: true })
    .order('lesson_number', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get user's quiz scores
export async function getQuizScores() {
  const session = await getSession();
  if (!session?.user) return [];

  const { data, error } = await supabase
    .from('quiz_scores')
    .select('*')
    .eq('user_id', session.user.id)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get user's points
export async function getUserPoints() {
  const session = await getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (error) throw error;
  return data;
}

// Export user data (GDPR)
export async function exportUserData() {
  const session = await getSession();
  if (!session?.user) throw new Error('Not authenticated');

  const [profile, progress, scores, points] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
    supabase.from('lesson_progress').select('*').eq('user_id', session.user.id),
    supabase.from('quiz_scores').select('*').eq('user_id', session.user.id),
    supabase.from('user_points').select('*').eq('user_id', session.user.id).single(),
  ]);

  return {
    exportDate: new Date().toISOString(),
    user: {
      id: session.user.id,
      email: session.user.email,
    },
    profile: profile.data,
    lessonProgress: progress.data,
    quizScores: scores.data,
    points: points.data,
  };
}

// Delete user account (GDPR)
export async function deleteAccount() {
  const session = await getSession();
  if (!session?.user) throw new Error('Not authenticated');

  // Note: Actual deletion requires a server-side function
  // This marks the profile for deletion
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: '[DELETED]' })
    .eq('id', session.user.id);

  if (error) throw error;

  // Sign out
  await signOut();
}

// Password reset
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/en/login?mode=reset`,
  });

  if (error) throw error;
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}

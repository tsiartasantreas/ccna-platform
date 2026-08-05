import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jhesstimsojwmkdysmpy.supabase.co',
  'sb_publishable_bKD9biIulcfC5iNipD-8IA_3Zu4bmWD'
);

// Subscribe to real-time changes on a table
export function subscribeToTable(
  table: string,
  filter: string,
  callback: (payload: any) => void
) {
  const channel = supabase
    .channel(`${table}-changes`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: table,
      filter: filter,
    }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Subscribe to user's own data changes
export function subscribeToUserData(userId: string, callbacks: {
  onProgressChange?: (payload: any) => void;
  onScoreChange?: (payload: any) => void;
  onPointsChange?: (payload: any) => void;
}) {
  const unsubscribes: (() => void)[] = [];

  if (callbacks.onProgressChange) {
    unsubscribes.push(
      subscribeToTable('lesson_progress', `user_id=eq.${userId}`, callbacks.onProgressChange)
    );
  }

  if (callbacks.onScoreChange) {
    unsubscribes.push(
      subscribeToTable('quiz_scores', `user_id=eq.${userId}`, callbacks.onScoreChange)
    );
  }

  if (callbacks.onPointsChange) {
    unsubscribes.push(
      subscribeToTable('user_points', `user_id=eq.${userId}`, callbacks.onPointsChange)
    );
  }

  return () => {
    unsubscribes.forEach(unsub => unsub());
  };
}

// Subscribe to all profile changes (for admin)
export function subscribeToAllProfiles(callback: (payload: any) => void) {
  return subscribeToTable('profiles', '', callback);
}

// Subscribe to all lesson progress (for admin)
export function subscribeToAllProgress(callback: (payload: any) => void) {
  return subscribeToTable('lesson_progress', '', callback);
}

// Subscribe to all quiz scores (for admin)
export function subscribeToAllScores(callback: (payload: any) => void) {
  return subscribeToTable('quiz_scores', '', callback);
}

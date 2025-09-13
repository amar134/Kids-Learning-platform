import { useState, useEffect } from 'react';
import { supabase, StudentStats, StudentProgress, DailyChallenge } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useStudentData() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.user_type === 'student') {
      fetchStudentData();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  const fetchStudentData = async () => {
    if (!user) return;

    try {
      // Fetch student stats
      const { data: statsData, error: statsError } = await supabase
        .from('student_stats')
        .select('*')
        .eq('student_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching stats:', statsError);
      } else if (statsData) {
        setStats(statsData);
      }

      // Fetch recent progress
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (progressError) {
        console.error('Error fetching progress:', progressError);
      } else {
        setProgress(progressData || []);
      }

      // Fetch today's challenges
      const today = new Date().toISOString().split('T')[0];
      const { data: challengesData, error: challengesError } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('student_id', user.id)
        .eq('challenge_date', today);

      if (challengesError) {
        console.error('Error fetching challenges:', challengesError);
      } else {
        setChallenges(challengesData || []);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (points: number) => {
    if (!user || !stats) return;

    const newTotalPoints = stats.total_points + points;
    
    const { data, error } = await supabase
      .from('student_stats')
      .update({ 
        total_points: newTotalPoints,
        last_activity: new Date().toISOString()
      })
      .eq('student_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating points:', error);
    } else {
      setStats(data);
    }
  };

  const addBadge = async (badge: string) => {
    if (!user || !stats) return;

    const newBadges = [...stats.badges, badge];
    
    const { data, error } = await supabase
      .from('student_stats')
      .update({ badges: newBadges })
      .eq('student_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error adding badge:', error);
    } else {
      setStats(data);
    }
  };

  const recordProgress = async (exerciseId: string, score: number, totalQuestions: number, timeSpent: number) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('student_progress')
      .insert({
        student_id: user.id,
        exercise_id: exerciseId,
        score,
        total_questions: totalQuestions,
        time_spent: timeSpent,
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording progress:', error);
    } else {
      setProgress(prev => [data, ...prev.slice(0, 9)]);
    }
  };

  const completeChallenge = async (challengeId: string, pointsAwarded: number = 10) => {
    const { data, error } = await supabase
      .from('daily_challenges')
      .update({ 
        is_completed: true,
        points_awarded: pointsAwarded
      })
      .eq('id', challengeId)
      .select()
      .single();

    if (error) {
      console.error('Error completing challenge:', error);
    } else {
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId ? data : challenge
        )
      );
      await addPoints(pointsAwarded);
    }
  };

  return {
    stats,
    progress,
    challenges,
    loading,
    addPoints,
    addBadge,
    recordProgress,
    completeChallenge,
    refreshData: fetchStudentData,
  };
}
import { useState, useEffect } from 'react';
import { supabase, Exercise } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useExercises() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchExercises();
    }
  }, [user]);

  const fetchExercises = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .or(`created_by.eq.${user.id},is_public.eq.true`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching exercises:', error);
      } else {
        setExercises(data || []);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const createExercise = async (exercise: Omit<Exercise, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('exercises')
      .insert({
        ...exercise,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    
    setExercises(prev => [data, ...prev]);
    return data;
  };

  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    const { data, error } = await supabase
      .from('exercises')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    setExercises(prev => 
      prev.map(exercise => 
        exercise.id === id ? data : exercise
      )
    );
    return data;
  };

  const deleteExercise = async (id: string) => {
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    setExercises(prev => prev.filter(exercise => exercise.id !== id));
  };

  const getExercisesBySubject = (subject: string) => {
    return exercises.filter(exercise => 
      exercise.subject === subject || exercise.subject === 'all'
    );
  };

  const getExercisesByGrade = (gradeLevel: number) => {
    return exercises.filter(exercise => exercise.grade_level === gradeLevel);
  };

  return {
    exercises,
    loading,
    createExercise,
    updateExercise,
    deleteExercise,
    getExercisesBySubject,
    getExercisesByGrade,
    refreshExercises: fetchExercises,
  };
}
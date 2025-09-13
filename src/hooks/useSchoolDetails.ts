import { useState, useEffect } from 'react';
import { supabase, SchoolDetails } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useSchoolDetails() {
  const { user } = useAuth();
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSchoolDetails();
    }
  }, [user]);

  const fetchSchoolDetails = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('school_details')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching school details:', error);
      } else {
        setSchoolDetails(data);
      }
    } catch (error) {
      console.error('Error fetching school details:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSchoolDetails = async (details: Omit<SchoolDetails, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    const schoolData = {
      ...details,
      user_id: user.id,
    };

    let data, error;

    if (schoolDetails) {
      // Update existing
      ({ data, error } = await supabase
        .from('school_details')
        .update(schoolData)
        .eq('user_id', user.id)
        .select()
        .single());
    } else {
      // Create new
      ({ data, error } = await supabase
        .from('school_details')
        .insert(schoolData)
        .select()
        .single());
    }

    if (error) throw error;
    
    setSchoolDetails(data);
    return data;
  };

  const deleteSchoolDetails = async () => {
    if (!user || !schoolDetails) return;

    const { error } = await supabase
      .from('school_details')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
    
    setSchoolDetails(null);
  };

  return {
    schoolDetails,
    loading,
    saveSchoolDetails,
    deleteSchoolDetails,
    refreshSchoolDetails: fetchSchoolDetails,
  };
}
import type { Grievance, GrievanceComment } from './types';
import { supabase } from './supabase';

// Admin functions for managing grievances and comments
export const deleteGrievanceComment = async (grievanceId: string, commentId: string): Promise<void> => {
  const { error } = await supabase
    .from('grievance_comments')
    .delete()
    .eq('id', commentId)
    .eq('grievance_id', grievanceId);

  if (error) throw error;
};

// Delete a grievance and its associated data
export const deleteGrievance = async (id: string): Promise<void> => {
  try {
    // First delete all comments
    const { error: commentsError } = await supabase
      .from('grievance_comments')
      .delete()
      .eq('grievance_id', id);

    if (commentsError) throw commentsError;

    // Then delete all likes
    const { error: likesError } = await supabase
      .from('grievance_likes')
      .delete()
      .eq('grievance_id', id);

    if (likesError) throw likesError;

    // Finally delete the grievance
    const { error } = await supabase
      .from('grievances')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting grievance:', error);
    throw error;
  }
};

const REPORTS_KEY = 'reports';

export const addGrievance = async (grievance: Omit<Grievance, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('grievances')
    .insert([
      {
        title: grievance.title,
        description: grievance.description,
        photo_url: grievance.photoDataUri,
        created_at: new Date().toISOString(),
      }
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    photoDataUri: data.photo_url,
    createdAt: data.created_at,
  };
};

export const getGrievances = async (): Promise<Grievance[]> => {
  const { data, error } = await supabase
    .from('grievances')
    .select(`
      *,
      likes_count,
      grievance_comments (
        id,
        text,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(grievance => ({
    id: grievance.id,
    title: grievance.title,
    description: grievance.description,
    photoDataUri: grievance.photo_url,
    createdAt: grievance.created_at,
    likes: grievance.likes_count || 0,
    comments: (grievance.grievance_comments || []).map((comment: any) => ({
      id: comment.id,
      grievanceId: grievance.id,
      text: comment.text,
      createdAt: comment.created_at,
    })),
  }));
};

export const getGrievanceById = async (id: string): Promise<Grievance | null> => {
  const { data, error } = await supabase
    .from('grievances')
    .select(`
      *,
      likes_count,
      grievance_comments (
        id,
        text,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    photoDataUri: data.photo_url,
    createdAt: data.created_at,
    likes: data.likes_count || 0,
    comments: (data.grievance_comments || []).map((comment: any) => ({
      id: comment.id,
      grievanceId: data.id,
      text: comment.text,
      createdAt: comment.created_at,
    })),
  };
};

export const toggleGrievanceLike = async (grievanceId: string): Promise<{ success: boolean; isLiked: boolean }> => {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user?.id;
  
  if (!userId) {
    throw new Error('User must be logged in to like grievances');
  }

  // Start a Supabase transaction
  const { data: existingLike, error: checkError } = await supabase
    .from('grievance_likes')
    .select('id')
    .eq('grievance_id', grievanceId)
    .eq('user_id', userId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw checkError;
  }

  try {
    if (existingLike) {
      // Unlike - first update the count, then remove the like
      const { error: rpcError } = await supabase
        .rpc('decrement_likes', { grievance_id: grievanceId });
      
      if (rpcError) throw rpcError;

      const { error: deleteError } = await supabase
        .from('grievance_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) throw deleteError;

      return { success: true, isLiked: false };
    } else {
      // Like - first add the like, then update the count
      const { error: insertError } = await supabase
        .from('grievance_likes')
        .insert([{ grievance_id: grievanceId, user_id: userId }]);

      if (insertError) throw insertError;

      const { error: rpcError } = await supabase
        .rpc('increment_likes', { grievance_id: grievanceId });
      
      if (rpcError) throw rpcError;

      return { success: true, isLiked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, isLiked: !!existingLike };
  }
};

export const addGrievanceComment = async (grievanceId: string, text: string): Promise<GrievanceComment> => {
  const { data, error } = await supabase
    .from('grievance_comments')
    .insert([
      { grievance_id: grievanceId, text }
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    grievanceId: data.grievance_id,
    text: data.text,
    createdAt: data.created_at,
  };
};

// Legacy code for reports
type LocalReport = {
    id: string;
    reportText: string;
    photoDataUri: string;
    crimeType: 'Government' | 'Civilian' | 'ICC';
    crimeSubType: string;
    createdAt: string;
    district: string;
    localAddress: string;
}

const initialReports: LocalReport[] = [
    {
        id: '1722384-24-2-8',
        reportText: 'A government official was seen accepting a bribe in broad daylight near the ministry office. The official was in a blue suit and was handed a thick envelope by a businessman. This has happened multiple times this month.',
        photoDataUri: 'https://picsum.photos/400/300',
        crimeType: 'Government',
        crimeSubType: 'Bribery',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        district: 'Kathmandu',
        localAddress: 'Singha Durbar',
    },
    {
        id: '1722384-23-1-9',
        reportText: 'Theft reported at a local electronics shop in Thamel. The suspect was caught on a CCTV camera wearing a red jacket and a black cap, smashing the front glass door and stealing several laptops and phones.',
        photoDataUri: 'https://picsum.photos/400/300',
        crimeType: 'Civilian',
        crimeSubType: 'Theft',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        district: 'Kathmandu',
        localAddress: 'Thamel',
    },
];

// Helper to safely access localStorage
const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorageItem = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

if (typeof window !== 'undefined' && !localStorage.getItem(REPORTS_KEY)) {
  setLocalStorageItem(REPORTS_KEY, initialReports);
}

export function getReportsByAgency(agency: 'Government' | 'Civilian' | 'ICC'): LocalReport[] {
  const reports = getLocalStorageItem<LocalReport[]>(REPORTS_KEY, []);
  return reports.filter(report => report.crimeType === agency).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

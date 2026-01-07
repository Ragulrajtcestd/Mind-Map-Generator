import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MindMapData, Keyword } from '@/types/mindmap';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useMindmaps() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mindmaps, setMindmaps] = useState<MindMapData[]>([]);

  const fetchMindmaps = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mindmaps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: MindMapData[] = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        sourceText: item.source_text,
        keywords: item.keywords as unknown as Keyword[],
        language: item.language || 'en',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setMindmaps(mapped);
    } catch (error) {
      console.error('Error fetching mindmaps:', error);
      toast.error('Failed to load mindmaps');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveMindmap = useCallback(async (mindmap: MindMapData) => {
    if (!user) {
      toast.error('Please sign in to save mindmaps');
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mindmaps')
        .insert({
          user_id: user.id,
          title: mindmap.title,
          source_text: mindmap.sourceText,
          keywords: JSON.parse(JSON.stringify(mindmap.keywords)),
          language: mindmap.language,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Mindmap saved successfully!');
      return data;
    } catch (error) {
      console.error('Error saving mindmap:', error);
      toast.error('Failed to save mindmap');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteMindmap = useCallback(async (id: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('mindmaps')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMindmaps((prev) => prev.filter((m) => m.id !== id));
      toast.success('Mindmap deleted');
      return true;
    } catch (error) {
      console.error('Error deleting mindmap:', error);
      toast.error('Failed to delete mindmap');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    mindmaps,
    loading,
    fetchMindmaps,
    saveMindmap,
    deleteMindmap,
  };
}

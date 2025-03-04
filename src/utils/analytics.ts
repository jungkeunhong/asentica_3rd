import { createClient } from '@/utils/supabase/client';

/**
 * Analytics utility functions for tracking user behavior
 */

/**
 * Track a search query in analytics
 * @param query The search query to track
 */
export const trackSearch = async (query: string): Promise<void> => {
  if (!query.trim()) return;
  
  try {
    const supabase = createClient();
    
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Track search in analytics table
    await supabase.from('search_analytics').insert({
      query: query.trim().toLowerCase(),
      user_id: userId || null,
      timestamp: new Date().toISOString(),
      source: typeof window !== 'undefined' ? window.location.pathname : 'server',
      referrer: typeof document !== 'undefined' ? document.referrer : null
    });
    
    // Update search_terms table with aggregated data
    const { data: existingTerm } = await supabase
      .from('search_terms')
      .select('count')
      .eq('term', query.trim().toLowerCase())
      .single();
    
    if (existingTerm) {
      // Term exists, increment count
      await supabase
        .from('search_terms')
        .update({ 
          count: existingTerm.count + 1,
          last_searched_at: new Date().toISOString()
        })
        .eq('term', query.trim().toLowerCase());
    } else {
      // New term, insert with count 1
      await supabase
        .from('search_terms')
        .insert({
          term: query.trim().toLowerCase(),
          count: 1,
          first_searched_at: new Date().toISOString(),
          last_searched_at: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Error tracking search:', error);
    // Fail silently in production
  }
};

/**
 * Get popular search terms
 * @param limit Number of terms to retrieve
 * @returns Array of popular search terms with counts
 */
export const getPopularSearchTerms = async (limit = 10): Promise<Array<{ term: string; count: number }>> => {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('search_terms')
      .select('term, count')
      .order('count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error getting popular search terms:', error);
    return [];
  }
};

/**
 * Track a page view in analytics
 * @param page The page path to track
 * @param title The page title
 */
export const trackPageView = async (page: string, title: string): Promise<void> => {
  try {
    const supabase = createClient();
    
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Track page view
    await supabase.from('page_views').insert({
      page,
      title,
      user_id: userId || null,
      timestamp: new Date().toISOString(),
      referrer: typeof document !== 'undefined' ? document.referrer : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
    // Fail silently in production
  }
};

'use client';

import { createClient } from '@/utils/supabase/client';
import { PostDraft, FilterOption } from '@/types/community';

// 게시물 관련 함수들
export const postsApi = {
  // 게시물 목록 조회
  async getPosts({ 
    sortBy = 'createdAt', 
    filterBy = null, 
    tagName = null, 
    limit = 20, 
    page = 1 
  }: { 
    sortBy?: string; 
    filterBy?: FilterOption | string | null; 
    tagName?: string | null; 
    limit?: number; 
    page?: number 
  } = {}) {
    try {
      console.log('getPosts called with:', { sortBy, filterBy, tagName, limit, page });
      
      // Check if running in browser environment
      if (typeof window === 'undefined') {
        console.warn('getPosts called in server context, returning mock data');
        return [];
      }
      
      const supabase = createClient();
      console.log('Supabase client created');
      
      // First check if client can connect by getting user
      try {
        const { data: authData, error: authError } = await supabase.auth.getSession();
        if (authError) {
          console.warn('Auth error when checking session:', authError);
        } else {
          console.log('Auth session check successful:', authData ? 'Session exists' : 'No session');
        }
      } catch (authCheckError) {
        console.error('Failed to check auth session:', authCheckError);
      }
      
      try {
        let query = supabase
          .from('posts')
          .select(`
            *,
            author:users(id, username, avatarUrl, isVerified, glow),
            tags:post_tags(tag_id, tags(id, name))
          `);
        
        console.log('Building query with sort:', sortBy);
        
        // 정렬 적용
        if (sortBy === 'latest') {
          query = query.order('created_at', { ascending: false });
        } else {
          query = query.order('upvote_count', { ascending: false });
        }
        
        // 필터 적용
        if (filterBy === 'saved') {
          // 저장된 게시물 필터링 (로그인 상태에서 사용자의 저장 목록 기반)
          console.log('Filtering by saved posts (not implemented)');
        }
        
        // 태그 필터링
        if (tagName) {
          console.log('Filtering by tag:', tagName);
          query = query.contains('tags', [tagName]);
        }
        
        // 페이지네이션
        const from = (page - 1) * limit;
        query = query.range(from, from + limit - 1);
        
        console.log('Executing Supabase query...');
        const { data, error } = await query;
        
        if (error) {
          console.error('Supabase error fetching posts:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          throw error;
        }
        
        console.log('Successfully fetched posts:', data?.length || 0);
        return data || [];
      } catch (queryError) {
        console.error('Error executing query:', queryError);
        throw queryError;
      }
    } catch (error) {
      console.error('Error in getPosts:', error);
      console.error('Stack trace:', new Error().stack);
      // Return empty array instead of throwing to allow UI to handle gracefully
      return [];
    }
  },
  
  // 단일 게시물 조회
  async getPostById(postId: string) {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:users(id, username, avatarUrl, isVerified, glow),
          tags:post_tags(tag_id, tags(id, name)),
          comments(*, author:users(id, username, avatarUrl, isVerified, glow))
        `)
        .eq('id', postId)
        .single();
      
      if (error) {
        console.error('Error fetching post:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getPostById:', error);
      return null;
    }
  },
  
  // 게시물 생성
  async createPost(postData: PostDraft) {
    try {
      const supabase = createClient();
      
      // 현재 로그인한 사용자 가져오기
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.warn('User not logged in, using mock flow instead');
          return createMockPost(postData);
        }
        
        // 게시물 기본 데이터
        const newPost = {
          title: postData.title || '',
          content: postData.content || '',
          format: postData.format || 'discussion',
          author_id: user.id,
          image_url: postData.images && postData.images.length > 0 ? postData.images[0] : null,
          before_image: postData.beforeImage || null,
          after_image: postData.afterImage || null,
          rating: postData.rating || null,
        };
        
        // 게시물 저장
        const { data, error } = await supabase
          .from('posts')
          .insert([newPost])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating post:', error);
          if (error.message.includes('JWT')) {
            return createMockPost(postData);
          }
          throw error;
        }
        
        // 태그 연결 (태그가 있는 경우)
        if (postData.tags && postData.tags.length > 0 && data) {
          const postTags = postData.tags.map(tagId => ({
            post_id: data.id,
            tag_id: tagId,
          }));
          
          const { error: tagError } = await supabase
            .from('post_tags')
            .insert(postTags);
          
          if (tagError) {
            console.error('Error adding tags to post:', tagError);
            // 태그 추가 실패는 전체 실패로 간주하지 않음
          }
        }
        
        return data;
      } catch (authError) {
        console.warn('Authentication error, using mock flow:', authError);
        return createMockPost(postData);
      }
    } catch (error) {
      console.error('Error in createPost:', error);
      // 최종 fallback: 목업 데이터 생성 시도
      return createMockPost(postData);
    }
  },
  
  // 게시물 업데이트
  async updatePost(postId: string, postData: Partial<PostDraft>) {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: postData.title,
          content: postData.content,
          format: postData.format,
          image_url: postData.images && postData.images.length > 0 ? postData.images[0] : null,
          before_image: postData.beforeImage || null,
          after_image: postData.afterImage || null,
          rating: postData.rating || null,
          updated_at: new Date(),
        })
        .eq('id', postId)
        .select();
      
      if (error) {
        console.error('Error updating post:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in updatePost:', error);
      throw error;
    }
  },
  
  // 게시물 좋아요 증가
  async likePost(postId: string) {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.rpc('increment_post_likes', {
        post_id: postId,
      });
      
      if (error) {
        console.error('Error liking post:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in likePost:', error);
      return null;
    }
  },
  
  // 게시물 저장
  async savePost(postId: string, userId: string) {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('saved_posts')
        .insert([
          { user_id: userId, post_id: postId }
        ]);
      
      if (error) {
        console.error('Error saving post:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in savePost:', error);
      return null;
    }
  },
  
  // 태그별 게시물 조회
  async getPostsByTag(tagName: string, limit = 20) {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:users(id, username, avatarUrl, isVerified, glow),
          tags:post_tags!inner(tag_id, tags!inner(id, name))
        `)
        .eq('tags.tags.name', tagName)
        .limit(limit);
      
      if (error) {
        console.error('Error fetching posts by tag:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getPostsByTag:', error);
      return [];
    }
  }
};

// Mock post creation helper function
function createMockPost(postData: PostDraft) {
  console.log('Creating mock post with data:', postData);
  
  // Generate a mock post that matches the structure expected by the frontend
  const mockPost = {
    id: `mock-${Date.now()}`,
    title: postData.title || '',
    content: postData.content || '',
    format: postData.format || 'discussion',
    author_id: 'mock-user',
    image_url: postData.images && postData.images.length > 0 ? postData.images[0] : null,
    before_image: postData.beforeImage || null,
    after_image: postData.afterImage || null,
    rating: postData.rating || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  // Save to localStorage for persistence during development
  try {
    const existingPosts = JSON.parse(localStorage.getItem('mockPosts') || '[]');
    existingPosts.push(mockPost);
    localStorage.setItem('mockPosts', JSON.stringify(existingPosts));
  } catch (storageError) {
    console.error('Failed to save mock post to localStorage:', storageError);
  }
  
  return mockPost;
} 
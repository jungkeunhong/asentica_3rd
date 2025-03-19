'use client';

import { createClient } from '@supabase/supabase-js';
import { CommunityPost, PostDraft } from '@/types/community';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 게시물 관련 함수들
export const postsApi = {
  // 게시물 목록 조회
  async getPosts({ sortBy = 'createdAt', filterBy = null, tagName = null, limit = 20, page = 1 }: 
    { sortBy?: string; filterBy?: string | null; tagName?: string | null; limit?: number; page?: number }
  ) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:users(id, username, avatarUrl, isVerified, glow),
        tags:post_tags(tag_id, tags(id, name))
      `)
      .order(sortBy === 'latest' ? 'created_at' : 'upvote_count', { ascending: false });
    
    // 필터 적용
    if (filterBy === 'saved') {
      // 저장된 게시물 필터링 (로그인 상태에서 사용자의 저장 목록 기반)
    }
    
    // 태그 필터링
    if (tagName) {
      query = query.contains('tags', [tagName]);
    }
    
    // 페이지네이션
    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
    
    return data;
  },
  
  // 단일 게시물 조회
  async getPostById(postId: string) {
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
  },
  
  // 게시물 생성
  async createPost(postData: PostDraft) {
    // 현재 로그인한 사용자 가져오기
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to create a post');
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
      throw error;
    }
    
    // 태그 연결 (태그가 있는 경우)
    if (postData.tags && postData.tags.length > 0) {
      const postTags = postData.tags.map(tagId => ({
        post_id: data.id,
        tag_id: tagId,
      }));
      
      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(postTags);
      
      if (tagError) {
        console.error('Error adding tags to post:', tagError);
        // 태그 추가 실패 처리
      }
    }
    
    return data;
  },
  
  // 게시물 업데이트
  async updatePost(postId: string, postData: Partial<PostDraft>) {
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
  },
  
  // 게시물 좋아요 증가
  async likePost(postId: string) {
    const { data, error } = await supabase.rpc('increment_post_likes', {
      post_id: postId,
    });
    
    if (error) {
      console.error('Error liking post:', error);
      throw error;
    }
    
    return data;
  },
  
  // 게시물 저장
  async savePost(postId: string, userId: string) {
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
  },
  
  // 태그별 게시물 조회
  async getPostsByTag(tagName: string, limit = 20) {
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
  }
}; 
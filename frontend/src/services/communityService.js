/**
 * Community API Service
 * Handles all community-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to get or create anonymous profile
const PROFILE_STORAGE_KEY = 'oral_scan_anonymous_profile';

export const getStoredProfile = () => {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const storeProfile = (profile) => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

export const createAnonymousProfile = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/community/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'user' })
        });
        const data = await response.json();
        if (data.success && data.profile) {
            storeProfile(data.profile);
            return data.profile;
        }
        throw new Error(data.error || 'Failed to create profile');
    } catch (error) {
        console.error('Create profile error:', error);
        throw error;
    }
};

export const getOrCreateProfile = async () => {
    let profile = getStoredProfile();
    if (!profile) {
        profile = await createAnonymousProfile();
    }
    return profile;
};

// Community Posts API
export const getPosts = async (category = null, limit = 20, offset = 0) => {
    try {
        const params = new URLSearchParams({ limit, offset });
        if (category) params.append('category', category);
        
        const response = await fetch(`${API_BASE_URL}/api/community/posts?${params}`);
        const data = await response.json();
        return data.success ? data.posts : [];
    } catch (error) {
        console.error('Get posts error:', error);
        return [];
    }
};

export const getPost = async (postId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/community/posts/${postId}`);
        const data = await response.json();
        return data.success ? { post: data.post, comments: data.comments } : null;
    } catch (error) {
        console.error('Get post error:', error);
        return null;
    }
};

export const createPost = async (title, content, category = 'general', imageUrl = null) => {
    try {
        const profile = await getOrCreateProfile();
        const response = await fetch(`${API_BASE_URL}/api/community/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profile_id: profile.id,
                title,
                content,
                category,
                image_url: imageUrl
            })
        });
        const data = await response.json();
        return data.success ? data.post : null;
    } catch (error) {
        console.error('Create post error:', error);
        throw error;
    }
};

// Recovery Stories API
export const getStories = async (diagnosisType = null, featuredOnly = false, limit = 20, offset = 0) => {
    try {
        const params = new URLSearchParams({ limit, offset });
        if (diagnosisType) params.append('diagnosis_type', diagnosisType);
        if (featuredOnly) params.append('featured', 'true');
        
        const response = await fetch(`${API_BASE_URL}/api/community/stories?${params}`);
        const data = await response.json();
        return data.success ? data.stories : [];
    } catch (error) {
        console.error('Get stories error:', error);
        return [];
    }
};

export const getStory = async (storyId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/community/stories/${storyId}`);
        const data = await response.json();
        return data.success ? { story: data.story, comments: data.comments } : null;
    } catch (error) {
        console.error('Get story error:', error);
        return null;
    }
};

export const createStory = async (storyData) => {
    try {
        const profile = await getOrCreateProfile();
        const response = await fetch(`${API_BASE_URL}/api/community/stories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profile_id: profile.id,
                ...storyData
            })
        });
        const data = await response.json();
        return data.success ? data.story : null;
    } catch (error) {
        console.error('Create story error:', error);
        throw error;
    }
};

// Comments API
export const createComment = async (content, postId = null, storyId = null, parentCommentId = null) => {
    try {
        const profile = await getOrCreateProfile();
        const response = await fetch(`${API_BASE_URL}/api/community/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profile_id: profile.id,
                content,
                post_id: postId,
                story_id: storyId,
                parent_comment_id: parentCommentId
            })
        });
        const data = await response.json();
        return data.success ? data.comment : null;
    } catch (error) {
        console.error('Create comment error:', error);
        throw error;
    }
};

// Reactions API
export const addReaction = async (reactionType = 'upvote', postId = null, storyId = null, commentId = null) => {
    try {
        const profile = await getOrCreateProfile();
        const response = await fetch(`${API_BASE_URL}/api/community/react`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profile_id: profile.id,
                reaction_type: reactionType,
                post_id: postId,
                story_id: storyId,
                comment_id: commentId
            })
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Add reaction error:', error);
        return false;
    }
};

// Category display helpers
export const CATEGORIES = {
    diagnosis_question: { label: 'Diagnosis Question', color: '#e50914', icon: '🔍' },
    treatment_advice: { label: 'Treatment Advice', color: '#46d369', icon: '💊' },
    second_opinion: { label: 'Second Opinion', color: '#f5c518', icon: '🩺' },
    general: { label: 'General', color: '#b3b3b3', icon: '💬' }
};

export const DIAGNOSIS_TYPES = {
    benign: { label: 'Benign', color: '#f5c518' },
    malignant: { label: 'Malignant', color: '#ff4757' },
    healthy: { label: 'Healthy', color: '#46d369' },
    other: { label: 'Other', color: '#b3b3b3' }
};

export const STATUS_OPTIONS = {
    fully_recovered: { label: 'Fully Recovered', color: '#46d369', icon: '✨' },
    in_treatment: { label: 'In Treatment', color: '#f5c518', icon: '💪' },
    monitoring: { label: 'Monitoring', color: '#3498db', icon: '👁️' },
    other: { label: 'Other', color: '#b3b3b3', icon: '📝' }
};

// Avatar generator (using DiceBear API)
export const getAvatarUrl = (seed) => {
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

// Time formatting helper
export const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
};

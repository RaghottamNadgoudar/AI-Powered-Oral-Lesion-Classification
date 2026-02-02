import { useState, useEffect } from 'react';
import PostCard from '../components/community/PostCard';
import StoryCard from '../components/community/StoryCard';
import CreatePostModal from '../components/community/CreatePostModal';
import CommentSection from '../components/community/CommentSection';
import {
    getPosts,
    getStories,
    getPost,
    getStory,
    CATEGORIES,
    DIAGNOSIS_TYPES,
    getAvatarUrl,
    formatTimeAgo
} from '../services/communityService';

function CommunityPage() {
    const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'stories'
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('post');

    // Detail view state
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedStory, setSelectedStory] = useState(null);
    const [detailComments, setDetailComments] = useState([]);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        loadContent();
    }, [activeTab, selectedCategory, selectedDiagnosis]);

    const loadContent = async () => {
        setLoading(true);
        try {
            if (activeTab === 'questions') {
                const data = await getPosts(selectedCategory);
                setPosts(data);
            } else {
                const data = await getStories(selectedDiagnosis);
                setStories(data);
            }
        } catch (err) {
            console.error('Failed to load content:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostClick = async (post) => {
        setLoadingDetail(true);
        try {
            const data = await getPost(post.id);
            if (data) {
                setSelectedPost(data.post);
                setDetailComments(data.comments);
            }
        } catch (err) {
            console.error('Failed to load post:', err);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleStoryClick = async (story) => {
        setLoadingDetail(true);
        try {
            const data = await getStory(story.id);
            if (data) {
                setSelectedStory(data.story);
                setDetailComments(data.comments);
            }
        } catch (err) {
            console.error('Failed to load story:', err);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleBack = () => {
        setSelectedPost(null);
        setSelectedStory(null);
        setDetailComments([]);
    };

    const handleCreateClick = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const handleSuccess = () => {
        loadContent();
    };

    const handleCommentAdded = (comment) => {
        setDetailComments(prev => [...prev, comment]);
    };

    // Render detail view for post
    if (selectedPost) {
        const category = CATEGORIES[selectedPost.category] || CATEGORIES.general;
        const profile = selectedPost.anonymous_profiles;

        return (
            <div className="min-h-screen pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-[#b3b3b3] hover:text-white mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Questions
                    </button>

                    {/* Post content */}
                    <article className="glass-card p-8 animate-fade-in">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={getAvatarUrl(profile?.avatar_seed || 'default')}
                                    alt="Avatar"
                                    className="w-12 h-12 rounded-full bg-[#2a2a2a]"
                                />
                                <div>
                                    <p className="text-white font-medium">
                                        {profile?.display_name || 'Anonymous'}
                                    </p>
                                    <p className="text-[#b3b3b3] text-sm">
                                        {formatTimeAgo(selectedPost.created_at)}
                                    </p>
                                </div>
                            </div>
                            <span
                                className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                                style={{
                                    backgroundColor: `${category.color}20`,
                                    color: category.color,
                                    border: `1px solid ${category.color}40`
                                }}
                            >
                                <span>{category.icon}</span>
                                {category.label}
                            </span>
                        </div>

                        {/* Title & Content */}
                        <h1 className="text-2xl font-bold text-white mb-4">
                            {selectedPost.title}
                        </h1>
                        <p className="text-[#b3b3b3] text-lg leading-relaxed whitespace-pre-line">
                            {selectedPost.content}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10">
                            <button className="flex items-center gap-2 text-[#b3b3b3] hover:text-[#e50914] transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                <span className="font-medium">{selectedPost.upvote_count || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 text-[#46d369] transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="font-medium">Support</span>
                            </button>
                        </div>

                        {/* Comments */}
                        <CommentSection
                            comments={detailComments}
                            postId={selectedPost.id}
                            onCommentAdded={handleCommentAdded}
                        />
                    </article>
                </div>
            </div>
        );
    }

    // Render detail view for story
    if (selectedStory) {
        const diagnosisType = DIAGNOSIS_TYPES[selectedStory.diagnosis_type] || DIAGNOSIS_TYPES.other;
        const profile = selectedStory.anonymous_profiles;

        return (
            <div className="min-h-screen pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-[#b3b3b3] hover:text-white mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Recovery Stories
                    </button>

                    {/* Story content */}
                    <article className="glass-card p-8 animate-fade-in">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={getAvatarUrl(profile?.avatar_seed || 'default')}
                                alt="Avatar"
                                className="w-12 h-12 rounded-full bg-[#2a2a2a]"
                            />
                            <div>
                                <p className="text-white font-medium">
                                    {profile?.display_name || 'Anonymous'}
                                </p>
                                <p className="text-[#b3b3b3] text-sm">
                                    {formatTimeAgo(selectedStory.created_at)}
                                </p>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-white mb-4">
                            {selectedStory.title}
                        </h1>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span
                                className="px-4 py-2 rounded-full text-sm font-medium"
                                style={{
                                    backgroundColor: `${diagnosisType.color}20`,
                                    color: diagnosisType.color,
                                    border: `1px solid ${diagnosisType.color}40`
                                }}
                            >
                                Diagnosis: {diagnosisType.label}
                            </span>
                            {selectedStory.current_status && (
                                <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#46d369]/20 text-[#46d369] border border-[#46d369]/40">
                                    ✨ {selectedStory.current_status.replace('_', ' ')}
                                </span>
                            )}
                            {selectedStory.recovery_duration && (
                                <span className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-[#b3b3b3] border border-white/10">
                                    🕐 Recovery: {selectedStory.recovery_duration}
                                </span>
                            )}
                        </div>

                        {/* Story content */}
                        <div className="prose prose-invert max-w-none">
                            <p className="text-[#b3b3b3] text-lg leading-relaxed whitespace-pre-line">
                                {selectedStory.story_content}
                            </p>
                        </div>

                        {/* Treatment summary */}
                        {selectedStory.treatment_summary && (
                            <div className="mt-8 p-6 bg-[#1f1f1f] rounded-xl border border-white/10">
                                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                    <span>💊</span> Treatment Summary
                                </h3>
                                <p className="text-[#b3b3b3] leading-relaxed">
                                    {selectedStory.treatment_summary}
                                </p>
                            </div>
                        )}

                        {/* Helpful tips */}
                        {selectedStory.helpful_tips && (
                            <div className="mt-6 p-6 bg-[#46d369]/10 rounded-xl border border-[#46d369]/20">
                                <h3 className="text-[#46d369] font-semibold mb-3 flex items-center gap-2">
                                    <span>💡</span> Helpful Tips from the Author
                                </h3>
                                <p className="text-[#b3b3b3] leading-relaxed">
                                    {selectedStory.helpful_tips}
                                </p>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10">
                            <button className="flex items-center gap-2 text-[#b3b3b3] hover:text-[#e50914] transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="font-medium">{selectedStory.upvote_count || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 text-[#f5c518] transition-colors">
                                <span>🙏</span>
                                <span className="font-medium">Thank You</span>
                            </button>
                        </div>

                        {/* Comments */}
                        <CommentSection
                            comments={detailComments}
                            storyId={selectedStory.id}
                            onCommentAdded={handleCommentAdded}
                        />
                    </article>
                </div>
            </div>
        );
    }

    // Main list view
    return (
        <div className="min-h-screen pt-28 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in pt-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        <span className="gradient-text">Community</span> Support
                    </h1>
                    <p className="text-[#b3b3b3] text-lg max-w-2xl mx-auto">
                        Connect anonymously with others, ask questions, and share your recovery journey.
                        Together, we reduce fear and stigma around oral health.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`px-8 py-4 rounded-xl font-medium transition-all ${activeTab === 'questions'
                            ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-lg shadow-[#e50914]/30'
                            : 'bg-[#2a2a2a] text-[#b3b3b3] hover:bg-[#3a3a3a]'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Expert Q&A
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('stories')}
                        className={`px-8 py-4 rounded-xl font-medium transition-all ${activeTab === 'stories'
                            ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-lg shadow-[#e50914]/30'
                            : 'bg-[#2a2a2a] text-[#b3b3b3] hover:bg-[#3a3a3a]'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Recovery Stories
                        </span>
                    </button>
                </div>

                {/* Filters & Create Button */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                        {activeTab === 'questions' ? (
                            <>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedCategory
                                        ? 'bg-white/10 text-white'
                                        : 'bg-transparent text-[#b3b3b3] hover:bg-white/5'
                                        }`}
                                >
                                    All
                                </button>
                                {Object.entries(CATEGORIES).map(([key, cat]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedCategory(key)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${selectedCategory === key
                                            ? 'bg-white/10 text-white'
                                            : 'bg-transparent text-[#b3b3b3] hover:bg-white/5'
                                            }`}
                                    >
                                        <span>{cat.icon}</span>
                                        {cat.label}
                                    </button>
                                ))}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setSelectedDiagnosis(null)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedDiagnosis
                                        ? 'bg-white/10 text-white'
                                        : 'bg-transparent text-[#b3b3b3] hover:bg-white/5'
                                        }`}
                                >
                                    All Stories
                                </button>
                                {Object.entries(DIAGNOSIS_TYPES).map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedDiagnosis(key)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDiagnosis === key
                                            ? 'bg-white/10 text-white'
                                            : 'bg-transparent text-[#b3b3b3] hover:bg-white/5'
                                            }`}
                                        style={{ color: selectedDiagnosis === key ? val.color : undefined }}
                                    >
                                        {val.label}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => handleCreateClick(activeTab === 'questions' ? 'post' : 'story')}
                        className="btn-primary"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {activeTab === 'questions' ? 'Ask Question' : 'Share Story'}
                    </button>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeTab === 'questions' ? (
                            posts.length === 0 ? (
                                <div className="col-span-2 text-center py-20">
                                    <p className="text-[#666] text-lg mb-4">No questions yet</p>
                                    <button
                                        onClick={() => handleCreateClick('post')}
                                        className="btn-secondary"
                                    >
                                        Be the first to ask a question
                                    </button>
                                </div>
                            ) : (
                                posts.map((post, index) => (
                                    <div
                                        key={post.id}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <PostCard
                                            post={post}
                                            onClick={() => handlePostClick(post)}
                                        />
                                    </div>
                                ))
                            )
                        ) : (
                            stories.length === 0 ? (
                                <div className="col-span-2 text-center py-20">
                                    <p className="text-[#666] text-lg mb-4">No recovery stories yet</p>
                                    <button
                                        onClick={() => handleCreateClick('story')}
                                        className="btn-secondary"
                                    >
                                        Share your recovery journey
                                    </button>
                                </div>
                            ) : (
                                stories.map((story, index) => (
                                    <div
                                        key={story.id}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <StoryCard
                                            story={story}
                                            onClick={() => handleStoryClick(story)}
                                        />
                                    </div>
                                ))
                            )
                        )}
                    </div>
                )}

                {/* Anonymity Notice */}
                <div className="mt-12 p-6 glass-card text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <svg className="w-8 h-8 text-[#46d369]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <h3 className="text-white font-semibold text-lg">Your Privacy is Protected</h3>
                    </div>
                    <p className="text-[#b3b3b3] max-w-2xl mx-auto">
                        All posts and stories are anonymous. A random display name and avatar are generated
                        for you automatically. Your real identity is never shared or stored.
                    </p>
                </div>
            </div>

            {/* Create Modal */}
            <CreatePostModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                type={modalType}
                onSuccess={handleSuccess}
            />
        </div>
    );
}

export default CommunityPage;

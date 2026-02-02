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
    const [activeTab, setActiveTab] = useState('questions');
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

    // Common styles
    const pageStyle = {
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '48px',
        paddingLeft: '24px',
        paddingRight: '24px'
    };

    const containerStyle = {
        maxWidth: '900px',
        margin: '0 auto'
    };

    const backButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#888',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '24px',
        fontSize: '14px',
        fontWeight: 500,
        padding: 0,
        transition: 'color 0.2s'
    };

    const articleStyle = {
        background: 'linear-gradient(145deg, rgba(42, 42, 42, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '32px'
    };

    const badgeStyle = (color) => ({
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`
    });

    // Detail view for post
    if (selectedPost) {
        const category = CATEGORIES[selectedPost.category] || CATEGORIES.general;
        const profile = selectedPost.anonymous_profiles;

        return (
            <div style={pageStyle}>
                <div style={containerStyle}>
                    <button
                        onClick={handleBack}
                        style={backButtonStyle}
                        onMouseEnter={(e) => e.target.style.color = 'white'}
                        onMouseLeave={(e) => e.target.style.color = '#888'}
                    >
                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Questions
                    </button>

                    <article style={articleStyle}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <img
                                    src={getAvatarUrl(profile?.avatar_seed || 'default')}
                                    alt="Avatar"
                                    style={{
                                        width: '52px',
                                        height: '52px',
                                        borderRadius: '50%',
                                        backgroundColor: '#2a2a2a',
                                        border: '2px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <p style={{ color: 'white', fontWeight: 600, fontSize: '15px', margin: 0 }}>
                                        {profile?.display_name || 'Anonymous'}
                                    </p>
                                    <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                                        {formatTimeAgo(selectedPost.created_at)}
                                    </p>
                                </div>
                            </div>
                            <span style={badgeStyle(category.color)}>
                                <span>{category.icon}</span>
                                {category.label}
                            </span>
                        </div>

                        {/* Title & Content */}
                        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '16px', lineHeight: 1.4 }}>
                            {selectedPost.title}
                        </h1>
                        <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>
                            {selectedPost.content}
                        </p>

                        {/* Stats */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                            marginTop: '32px',
                            paddingTop: '24px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#888',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: 0
                            }}>
                                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                <span>{selectedPost.upvote_count || 0}</span>
                            </button>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#46d369',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: 0
                            }}>
                                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>Support</span>
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

    // Detail view for story
    if (selectedStory) {
        const diagnosisType = DIAGNOSIS_TYPES[selectedStory.diagnosis_type] || DIAGNOSIS_TYPES.other;
        const profile = selectedStory.anonymous_profiles;

        return (
            <div style={pageStyle}>
                <div style={containerStyle}>
                    <button
                        onClick={handleBack}
                        style={backButtonStyle}
                        onMouseEnter={(e) => e.target.style.color = 'white'}
                        onMouseLeave={(e) => e.target.style.color = '#888'}
                    >
                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Recovery Stories
                    </button>

                    <article style={articleStyle}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                            <img
                                src={getAvatarUrl(profile?.avatar_seed || 'default')}
                                alt="Avatar"
                                style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '50%',
                                    backgroundColor: '#2a2a2a',
                                    border: '2px solid rgba(255, 255, 255, 0.1)'
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <p style={{ color: 'white', fontWeight: 600, fontSize: '15px', margin: 0 }}>
                                    {profile?.display_name || 'Anonymous'}
                                </p>
                                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                                    {formatTimeAgo(selectedStory.created_at)}
                                </p>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '20px', lineHeight: 1.4 }}>
                            {selectedStory.title}
                        </h1>

                        {/* Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
                            <span style={badgeStyle(diagnosisType.color)}>
                                Diagnosis: {diagnosisType.label}
                            </span>
                            {selectedStory.current_status && (
                                <span style={badgeStyle('#46d369')}>
                                    ✨ {selectedStory.current_status.replace('_', ' ')}
                                </span>
                            )}
                            {selectedStory.recovery_duration && (
                                <span style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: '#a0a0a0',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    🕐 Recovery: {selectedStory.recovery_duration}
                                </span>
                            )}
                        </div>

                        {/* Story content */}
                        <p style={{ color: '#a0a0a0', fontSize: '16px', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>
                            {selectedStory.story_content}
                        </p>

                        {/* Treatment summary */}
                        {selectedStory.treatment_summary && (
                            <div style={{
                                marginTop: '32px',
                                padding: '24px',
                                backgroundColor: '#1f1f1f',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <h3 style={{
                                    color: 'white',
                                    fontWeight: 600,
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '16px'
                                }}>
                                    <span>💊</span> Treatment Summary
                                </h3>
                                <p style={{ color: '#a0a0a0', lineHeight: 1.7, margin: 0 }}>
                                    {selectedStory.treatment_summary}
                                </p>
                            </div>
                        )}

                        {/* Helpful tips */}
                        {selectedStory.helpful_tips && (
                            <div style={{
                                marginTop: '24px',
                                padding: '24px',
                                backgroundColor: 'rgba(70, 211, 105, 0.1)',
                                borderRadius: '16px',
                                border: '1px solid rgba(70, 211, 105, 0.2)'
                            }}>
                                <h3 style={{
                                    color: '#46d369',
                                    fontWeight: 600,
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '16px'
                                }}>
                                    <span>💡</span> Helpful Tips from the Author
                                </h3>
                                <p style={{ color: '#a0a0a0', lineHeight: 1.7, margin: 0 }}>
                                    {selectedStory.helpful_tips}
                                </p>
                            </div>
                        )}

                        {/* Stats */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                            marginTop: '32px',
                            paddingTop: '24px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#888',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: 0
                            }}>
                                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{selectedStory.upvote_count || 0}</span>
                            </button>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#f5c518',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: 0
                            }}>
                                <span>🙏</span>
                                <span>Thank You</span>
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

    // Main list view - use wider container
    const mainContainerStyle = {
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const primaryButtonStyle = {
        padding: '14px 28px',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(135deg, #e50914, #b20710)',
        color: 'white',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)',
        transition: 'all 0.2s',
        flexShrink: 0
    };

    const secondaryButtonStyle = {
        padding: '12px 24px',
        borderRadius: '10px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        background: 'transparent',
        color: '#b3b3b3',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer'
    };

    return (
        <div style={pageStyle}>
            <div style={mainContainerStyle}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
                        <span style={{ background: 'linear-gradient(135deg, #e50914, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Community</span> Support
                    </h1>
                    <p style={{ color: '#a0a0a0', fontSize: '18px', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
                        Connect anonymously with others, ask questions, and share your recovery journey.
                        Together, we reduce fear and stigma around oral health.
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
                    <button
                        onClick={() => setActiveTab('questions')}
                        style={{
                            padding: '16px 32px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s',
                            background: activeTab === 'questions' ? 'linear-gradient(135deg, #e50914, #b20710)' : '#2a2a2a',
                            color: activeTab === 'questions' ? 'white' : '#888',
                            boxShadow: activeTab === 'questions' ? '0 8px 24px rgba(229, 9, 20, 0.3)' : 'none'
                        }}
                    >
                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Expert Q&A
                    </button>
                    <button
                        onClick={() => setActiveTab('stories')}
                        style={{
                            padding: '16px 32px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s',
                            background: activeTab === 'stories' ? 'linear-gradient(135deg, #e50914, #b20710)' : '#2a2a2a',
                            color: activeTab === 'stories' ? 'white' : '#888',
                            boxShadow: activeTab === 'stories' ? '0 8px 24px rgba(229, 9, 20, 0.3)' : 'none'
                        }}
                    >
                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Recovery Stories
                    </button>
                </div>

                {/* Filters & Create Button Row */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '32px',
                    gap: '16px'
                }}>
                    {/* Filters */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: '1 1 auto' }}>
                        {activeTab === 'questions' ? (
                            <>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: !selectedCategory ? 'rgba(255,255,255,0.15)' : 'transparent',
                                        color: !selectedCategory ? 'white' : '#888'
                                    }}
                                >
                                    All
                                </button>
                                {Object.entries(CATEGORIES).map(([key, cat]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedCategory(key)}
                                        style={{
                                            padding: '10px 18px',
                                            borderRadius: '10px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: selectedCategory === key ? 'rgba(255,255,255,0.15)' : 'transparent',
                                            color: selectedCategory === key ? 'white' : '#888'
                                        }}
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
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: !selectedDiagnosis ? 'rgba(255,255,255,0.15)' : 'transparent',
                                        color: !selectedDiagnosis ? 'white' : '#888'
                                    }}
                                >
                                    All Stories
                                </button>
                                {Object.entries(DIAGNOSIS_TYPES).map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedDiagnosis(key)}
                                        style={{
                                            padding: '10px 18px',
                                            borderRadius: '10px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: selectedDiagnosis === key ? 'rgba(255,255,255,0.15)' : 'transparent',
                                            color: selectedDiagnosis === key ? val.color : '#888'
                                        }}
                                    >
                                        {val.label}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={() => handleCreateClick(activeTab === 'questions' ? 'post' : 'story')}
                        style={primaryButtonStyle}
                    >
                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {activeTab === 'questions' ? 'Ask Question' : 'Share Story'}
                    </button>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid rgba(229, 9, 20, 0.2)',
                            borderTopColor: '#e50914',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '24px'
                    }}>
                        {activeTab === 'questions' ? (
                            posts.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0' }}>
                                    <p style={{ color: '#666', fontSize: '18px', marginBottom: '20px' }}>No questions yet</p>
                                    <button
                                        onClick={() => handleCreateClick('post')}
                                        style={secondaryButtonStyle}
                                    >
                                        Be the first to ask a question
                                    </button>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onClick={() => handlePostClick(post)}
                                    />
                                ))
                            )
                        ) : (
                            stories.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0' }}>
                                    <p style={{ color: '#666', fontSize: '18px', marginBottom: '20px' }}>No recovery stories yet</p>
                                    <button
                                        onClick={() => handleCreateClick('story')}
                                        style={secondaryButtonStyle}
                                    >
                                        Share your recovery journey
                                    </button>
                                </div>
                            ) : (
                                stories.map((story) => (
                                    <StoryCard
                                        key={story.id}
                                        story={story}
                                        onClick={() => handleStoryClick(story)}
                                    />
                                ))
                            )
                        )}
                    </div>
                )}

                {/* Anonymity Notice */}
                <div style={{
                    marginTop: '48px',
                    padding: '28px',
                    textAlign: 'center',
                    background: 'linear-gradient(145deg, rgba(42, 42, 42, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '16px' }}>
                        <svg style={{ width: '32px', height: '32px', color: '#46d369' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <h3 style={{ color: 'white', fontWeight: 600, fontSize: '18px', margin: 0 }}>Your Privacy is Protected</h3>
                    </div>
                    <p style={{ color: '#a0a0a0', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
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

            {/* Keyframe animation for spinner */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default CommunityPage;

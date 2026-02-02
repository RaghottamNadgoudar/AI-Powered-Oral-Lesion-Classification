import { CATEGORIES, getAvatarUrl, formatTimeAgo } from '../../services/communityService';

function PostCard({ post, onClick }) {
    const category = CATEGORIES[post.category] || CATEGORIES.general;
    const profile = post.anonymous_profiles;

    const cardStyle = {
        background: 'linear-gradient(145deg, rgba(42, 42, 42, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    };

    return (
        <div
            style={cardStyle}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src={getAvatarUrl(profile?.avatar_seed || 'default')}
                        alt="Avatar"
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: '#2a2a2a',
                            border: '2px solid rgba(255, 255, 255, 0.1)'
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <p style={{ color: 'white', fontWeight: 600, fontSize: '14px', margin: 0 }}>
                            {profile?.display_name || 'Anonymous'}
                        </p>
                        <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
                            {formatTimeAgo(post.created_at)}
                        </p>
                    </div>
                </div>

                {/* Category Badge */}
                <span
                    style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                        border: `1px solid ${category.color}40`
                    }}
                >
                    <span>{category.icon}</span>
                    {category.label}
                </span>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '17px',
                    margin: 0,
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {post.title}
                </h3>
                <p style={{
                    color: '#a0a0a0',
                    fontSize: '14px',
                    margin: 0,
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {post.content}
                </p>
            </div>

            {/* Footer Stats */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                marginTop: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span style={{ fontWeight: 500 }}>{post.upvote_count || 0}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span style={{ fontWeight: 500 }}>{post.comment_count || 0}</span>
                </div>

                {post.is_answered && (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#46d369',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginLeft: 'auto'
                    }}>
                        <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        Answered
                    </span>
                )}

                {post.expert_verified && (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#f5c518',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginLeft: post.is_answered ? '0' : 'auto'
                    }}>
                        <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Expert
                    </span>
                )}
            </div>
        </div>
    );
}

export default PostCard;

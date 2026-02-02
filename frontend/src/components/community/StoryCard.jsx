import { DIAGNOSIS_TYPES, STATUS_OPTIONS, getAvatarUrl, formatTimeAgo } from '../../services/communityService';

function StoryCard({ story, onClick }) {
    const diagnosisType = DIAGNOSIS_TYPES[story.diagnosis_type] || DIAGNOSIS_TYPES.other;
    const status = STATUS_OPTIONS[story.current_status] || STATUS_OPTIONS.other;
    const profile = story.anonymous_profiles;

    const cardStyle = {
        background: 'linear-gradient(145deg, rgba(42, 42, 42, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden'
    };

    return (
        <div
            style={cardStyle}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(70, 211, 105, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
        >
            {/* Featured Badge */}
            {story.is_featured && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'linear-gradient(135deg, #e50914, transparent)',
                    padding: '6px 16px',
                    borderBottomLeftRadius: '12px'
                }}>
                    <span style={{ color: 'white', fontSize: '11px', fontWeight: 600 }}>⭐ Featured</span>
                </div>
            )}

            {/* Header */}
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
                        {formatTimeAgo(story.created_at)}
                    </p>
                </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span
                    style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: `${diagnosisType.color}20`,
                        color: diagnosisType.color,
                        border: `1px solid ${diagnosisType.color}40`
                    }}
                >
                    {diagnosisType.label}
                </span>

                <span
                    style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: `${status.color}20`,
                        color: status.color,
                        border: `1px solid ${status.color}40`
                    }}
                >
                    <span>{status.icon}</span>
                    {status.label}
                </span>

                {story.recovery_duration && (
                    <span style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 500,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#a0a0a0',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        🕐 {story.recovery_duration}
                    </span>
                )}
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
                    {story.title}
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
                    {story.story_content}
                </p>
            </div>

            {/* Helpful Tips Preview */}
            {story.helpful_tips && (
                <div style={{
                    background: 'rgba(70, 211, 105, 0.1)',
                    border: '1px solid rgba(70, 211, 105, 0.2)',
                    borderRadius: '12px',
                    padding: '12px'
                }}>
                    <p style={{
                        color: '#46d369',
                        fontSize: '11px',
                        fontWeight: 600,
                        margin: '0 0 6px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <span>💡</span> Helpful Tip
                    </p>
                    <p style={{
                        color: '#a0a0a0',
                        fontSize: '13px',
                        margin: 0,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {story.helpful_tips}
                    </p>
                </div>
            )}

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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span style={{ fontWeight: 500 }}>{story.upvote_count || 0}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px' }}>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span style={{ fontWeight: 500 }}>{story.comment_count || 0}</span>
                </div>
            </div>
        </div>
    );
}

export default StoryCard;

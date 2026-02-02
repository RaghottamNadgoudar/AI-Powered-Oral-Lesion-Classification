import { DIAGNOSIS_TYPES, STATUS_OPTIONS, getAvatarUrl, formatTimeAgo } from '../../services/communityService';

function StoryCard({ story, onClick }) {
    const diagnosisType = DIAGNOSIS_TYPES[story.diagnosis_type] || DIAGNOSIS_TYPES.other;
    const status = STATUS_OPTIONS[story.current_status] || STATUS_OPTIONS.other;
    const profile = story.anonymous_profiles;

    return (
        <div
            className="glass-card p-6 hover-lift cursor-pointer transition-all duration-300 relative overflow-hidden"
            onClick={onClick}
        >
            {/* Featured Badge */}
            {story.is_featured && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#e50914] to-transparent px-4 py-1">
                    <span className="text-white text-xs font-medium">⭐ Featured</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img
                        src={getAvatarUrl(profile?.avatar_seed || 'default')}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full bg-[#2a2a2a]"
                    />
                    <div>
                        <p className="text-white font-medium text-sm">
                            {profile?.display_name || 'Anonymous'}
                        </p>
                        <p className="text-[#b3b3b3] text-xs">
                            {formatTimeAgo(story.created_at)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                        backgroundColor: `${diagnosisType.color}20`,
                        color: diagnosisType.color,
                        border: `1px solid ${diagnosisType.color}40`
                    }}
                >
                    {diagnosisType.label}
                </span>

                <span
                    className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{
                        backgroundColor: `${status.color}20`,
                        color: status.color,
                        border: `1px solid ${status.color}40`
                    }}
                >
                    <span>{status.icon}</span>
                    {status.label}
                </span>

                {story.recovery_duration && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-[#b3b3b3] border border-white/10">
                        🕐 {story.recovery_duration}
                    </span>
                )}
            </div>

            {/* Content */}
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                {story.title}
            </h3>
            <p className="text-[#b3b3b3] text-sm line-clamp-3 mb-4">
                {story.story_content}
            </p>

            {/* Helpful Tips Preview */}
            {story.helpful_tips && (
                <div className="bg-[#46d369]/10 border border-[#46d369]/20 rounded-lg p-3 mb-4">
                    <p className="text-[#46d369] text-xs font-medium mb-1 flex items-center gap-1">
                        <span>💡</span> Helpful Tip
                    </p>
                    <p className="text-[#b3b3b3] text-sm line-clamp-2">
                        {story.helpful_tips}
                    </p>
                </div>
            )}

            {/* Footer Stats */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[#b3b3b3] text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{story.upvote_count || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-[#b3b3b3] text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{story.comment_count || 0}</span>
                </div>
            </div>
        </div>
    );
}

export default StoryCard;

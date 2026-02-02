import { useState } from 'react';
import { CATEGORIES, getAvatarUrl, formatTimeAgo } from '../../services/communityService';

function PostCard({ post, onClick }) {
    const category = CATEGORIES[post.category] || CATEGORIES.general;
    const profile = post.anonymous_profiles;

    return (
        <div
            className="glass-card p-6 hover-lift cursor-pointer transition-all duration-300"
            onClick={onClick}
        >
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
                            {formatTimeAgo(post.created_at)}
                        </p>
                    </div>
                </div>

                {/* Category Badge */}
                <span
                    className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
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

            {/* Content */}
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                {post.title}
            </h3>
            <p className="text-[#b3b3b3] text-sm line-clamp-3 mb-4">
                {post.content}
            </p>

            {/* Footer Stats */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[#b3b3b3] text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span>{post.upvote_count || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-[#b3b3b3] text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post.comment_count || 0}</span>
                </div>

                {post.is_answered && (
                    <span className="flex items-center gap-1 text-[#46d369] text-sm ml-auto">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        Answered
                    </span>
                )}

                {post.expert_verified && (
                    <span className="flex items-center gap-1 text-[#f5c518] text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Expert Verified
                    </span>
                )}
            </div>
        </div>
    );
}

export default PostCard;

import { useState } from 'react';
import { getAvatarUrl, formatTimeAgo, createComment } from '../../services/communityService';

function CommentSection({ comments = [], postId = null, storyId = null, onCommentAdded }) {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);

    const handleSubmit = async (e, parentCommentId = null) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const comment = await createComment(newComment, postId, storyId, parentCommentId);
            if (comment) {
                setNewComment('');
                setReplyingTo(null);
                onCommentAdded && onCommentAdded(comment);
            }
        } catch (err) {
            console.error('Failed to add comment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Group comments by parent
    const topLevelComments = comments.filter(c => !c.parent_comment_id);
    const repliesMap = comments.reduce((acc, comment) => {
        if (comment.parent_comment_id) {
            if (!acc[comment.parent_comment_id]) acc[comment.parent_comment_id] = [];
            acc[comment.parent_comment_id].push(comment);
        }
        return acc;
    }, {});

    const renderComment = (comment, isReply = false) => {
        const profile = comment.anonymous_profiles;
        const replies = repliesMap[comment.id] || [];

        return (
            <div key={comment.id} className={`${isReply ? 'ml-12 border-l-2 border-white/10 pl-4' : ''}`}>
                <div className="flex gap-3 py-4">
                    <img
                        src={getAvatarUrl(profile?.avatar_seed || 'default')}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full bg-[#2a2a2a] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-sm font-medium">
                                {profile?.display_name || 'Anonymous'}
                            </span>
                            {comment.is_expert_reply && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#f5c518]/20 text-[#f5c518] border border-[#f5c518]/30">
                                    Expert
                                </span>
                            )}
                            <span className="text-[#666] text-xs">
                                {formatTimeAgo(comment.created_at)}
                            </span>
                        </div>
                        <p className="text-[#b3b3b3] text-sm break-words">
                            {comment.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <button className="text-[#666] hover:text-[#e50914] text-xs flex items-center gap-1 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                {comment.upvote_count || 0}
                            </button>
                            {!isReply && (
                                <button
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                    className="text-[#666] hover:text-white text-xs transition-colors"
                                >
                                    Reply
                                </button>
                            )}
                        </div>

                        {/* Reply form */}
                        {replyingTo === comment.id && (
                            <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="flex-1 bg-[#1f1f1f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#e50914]"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newComment.trim()}
                                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                                >
                                    {isSubmitting ? '...' : 'Reply'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Render replies */}
                {replies.map(reply => renderComment(reply, true))}
            </div>
        );
    };

    return (
        <div className="mt-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments ({comments.length})
            </h3>

            {/* Add comment form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e50914] to-[#b20710] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">You</span>
                    </div>
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={replyingTo ? '' : newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={!!replyingTo}
                            placeholder="Add a comment..."
                            className="flex-1 bg-[#1f1f1f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#666] focus:outline-none focus:border-[#e50914] transition-colors disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim() || !!replyingTo}
                            className="btn-primary px-6 py-3 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span className="spinner w-4 h-4 border-2"></span>
                            ) : (
                                'Post'
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments list */}
            <div className="divide-y divide-white/5">
                {topLevelComments.length === 0 ? (
                    <p className="text-[#666] text-center py-8">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    topLevelComments.map(comment => renderComment(comment))
                )}
            </div>
        </div>
    );
}

export default CommentSection;

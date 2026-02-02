import { useState } from 'react';
import { createComment, getAvatarUrl, formatTimeAgo } from '../../services/communityService';

function CommentSection({ comments = [], postId = null, storyId = null, onCommentAdded }) {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const comment = await createComment(newComment, postId, storyId, null);
            if (comment) {
                setNewComment('');
                onCommentAdded && onCommentAdded(comment);
            }
        } catch (err) {
            console.error('Failed to post comment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (parentId) => {
        if (!replyText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const comment = await createComment(replyText, postId, storyId, parentId);
            if (comment) {
                setReplyText('');
                setReplyingTo(null);
                onCommentAdded && onCommentAdded(comment);
            }
        } catch (err) {
            console.error('Failed to post reply:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Group comments by parent
    const topLevelComments = comments.filter(c => !c.parent_comment_id);
    const replies = comments.filter(c => c.parent_comment_id);

    const getReplies = (commentId) => replies.filter(r => r.parent_comment_id === commentId);

    const inputStyle = {
        flex: 1,
        backgroundColor: '#1a1a1a',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '12px 16px',
        color: 'white',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    const buttonStyle = {
        padding: '12px 24px',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(135deg, #e50914, #b20710)',
        color: 'white',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    };

    const CommentItem = ({ comment, isReply = false }) => {
        const profile = comment.anonymous_profiles;

        return (
            <div style={{
                display: 'flex',
                gap: '12px',
                padding: isReply ? '12px 0 12px 40px' : '16px 0',
                borderBottom: isReply ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <img
                    src={getAvatarUrl(profile?.avatar_seed || 'default')}
                    alt="Avatar"
                    style={{
                        width: isReply ? '32px' : '40px',
                        height: isReply ? '32px' : '40px',
                        borderRadius: '50%',
                        backgroundColor: '#2a2a2a',
                        flexShrink: 0
                    }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>
                            {profile?.display_name || 'Anonymous'}
                        </span>
                        {comment.is_expert_reply && (
                            <span style={{
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #f5c518, #e6b800)',
                                color: '#1a1a1a'
                            }}>
                                ⭐ EXPERT
                            </span>
                        )}
                        <span style={{ color: '#666', fontSize: '12px' }}>
                            {formatTimeAgo(comment.created_at)}
                        </span>
                    </div>
                    <p style={{ color: '#c0c0c0', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                        {comment.content}
                    </p>

                    {!isReply && (
                        <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#888',
                                fontSize: '12px',
                                cursor: 'pointer',
                                padding: '4px 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '4px'
                            }}
                        >
                            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Reply
                        </button>
                    )}

                    {/* Reply input */}
                    {replyingTo === comment.id && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                style={{ ...inputStyle, padding: '10px 14px', fontSize: '13px' }}
                                onFocus={(e) => e.target.style.borderColor = '#e50914'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            />
                            <button
                                onClick={() => handleReply(comment.id)}
                                disabled={isSubmitting}
                                style={{ ...buttonStyle, padding: '10px 18px', fontSize: '13px' }}
                            >
                                {isSubmitting ? '...' : 'Reply'}
                            </button>
                        </div>
                    )}

                    {/* Nested replies */}
                    {getReplies(comment.id).map(reply => (
                        <CommentItem key={reply.id} comment={reply} isReply />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div style={{ marginTop: '32px' }}>
            {/* Header */}
            <h3 style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments ({comments.length})
            </h3>

            {/* New comment form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#e50914'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    style={{
                        ...buttonStyle,
                        opacity: isSubmitting || !newComment.trim() ? 0.5 : 1,
                        cursor: isSubmitting || !newComment.trim() ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSubmitting ? (
                        <span>Posting...</span>
                    ) : (
                        <span>Post</span>
                    )}
                </button>
            </form>

            {/* Comments list */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {topLevelComments.length === 0 ? (
                    <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    topLevelComments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;

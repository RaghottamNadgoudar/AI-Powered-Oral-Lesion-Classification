import { useState } from 'react';
import { CATEGORIES, DIAGNOSIS_TYPES, STATUS_OPTIONS, createPost, createStory } from '../../services/communityService';

function CreatePostModal({ isOpen, onClose, type = 'post', onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'general',
        // Story-specific fields
        diagnosis_type: '',
        treatment_summary: '',
        recovery_duration: '',
        current_status: '',
        helpful_tips: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (type === 'post') {
                const post = await createPost(formData.title, formData.content, formData.category);
                if (post) {
                    onSuccess && onSuccess(post);
                    onClose();
                    resetForm();
                }
            } else {
                const story = await createStory({
                    title: formData.title,
                    story_content: formData.content,
                    diagnosis_type: formData.diagnosis_type || null,
                    treatment_summary: formData.treatment_summary || null,
                    recovery_duration: formData.recovery_duration || null,
                    current_status: formData.current_status || null,
                    helpful_tips: formData.helpful_tips || null
                });
                if (story) {
                    onSuccess && onSuccess(story);
                    onClose();
                    resetForm();
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            category: 'general',
            diagnosis_type: '',
            treatment_summary: '',
            recovery_duration: '',
            current_status: '',
            helpful_tips: ''
        });
    };

    if (!isOpen) return null;

    // Styles
    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
    };

    const backdropStyle = {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)'
    };

    const modalStyle = {
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '85vh',
        overflowY: 'auto',
        background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    };

    const headerStyle = {
        position: 'sticky',
        top: 0,
        background: 'linear-gradient(135deg, #e50914 0%, #b20710 100%)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '20px 20px 0 0'
    };

    const inputStyle = {
        width: '100%',
        backgroundColor: '#1a1a1a',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '14px 18px',
        color: 'white',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s'
    };

    const inputFocusStyle = {
        borderColor: '#e50914',
        boxShadow: '0 0 0 3px rgba(229, 9, 20, 0.2)'
    };

    const labelStyle = {
        display: 'block',
        color: 'white',
        fontWeight: 600,
        marginBottom: '10px',
        fontSize: '14px',
        letterSpacing: '0.5px'
    };

    const categoryButtonStyle = (isSelected) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 18px',
        borderRadius: '12px',
        border: isSelected ? '2px solid #e50914' : '2px solid rgba(255, 255, 255, 0.1)',
        background: isSelected ? 'rgba(229, 9, 20, 0.15)' : '#1a1a1a',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
        flex: 1
    });

    return (
        <div style={overlayStyle}>
            {/* Backdrop */}
            <div style={backdropStyle} onClick={onClose} />

            {/* Modal */}
            <div style={modalStyle} className="animate-fade-in">
                {/* Header */}
                <div style={headerStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '28px' }}>
                            {type === 'post' ? '💬' : '✨'}
                        </span>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>
                                {type === 'post' ? 'Ask the Community' : 'Share Your Story'}
                            </h2>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0' }}>
                                {type === 'post' ? 'Get answers from our supportive community' : 'Inspire others with your journey'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Anonymity Notice */}
                <div style={{
                    padding: '14px 24px',
                    background: 'rgba(70, 211, 105, 0.1)',
                    borderBottom: '1px solid rgba(70, 211, 105, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <svg style={{ width: '18px', height: '18px', color: '#46d369', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span style={{ color: '#46d369', fontSize: '14px', fontWeight: 500 }}>
                        🔒 Your identity is protected. A random display name will be assigned.
                    </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {error && (
                        <div style={{
                            background: 'rgba(255, 71, 87, 0.1)',
                            border: '1px solid rgba(255, 71, 87, 0.3)',
                            borderRadius: '12px',
                            padding: '14px 18px',
                            color: '#ff4757',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label style={labelStyle}>
                            {type === 'post' ? '📝 Question Title' : '📝 Story Title'} <span style={{ color: '#e50914' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder={type === 'post' ? 'What would you like to ask?' : 'Give your story a meaningful title'}
                            style={inputStyle}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Category (Posts only) */}
                    {type === 'post' && (
                        <div>
                            <label style={labelStyle}>🏷️ Category</label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '12px'
                            }}>
                                {Object.entries(CATEGORIES).map(([key, cat]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, category: key }))}
                                        style={categoryButtonStyle(formData.category === key)}
                                    >
                                        <span style={{ fontSize: '22px' }}>{cat.icon}</span>
                                        <span style={{
                                            color: formData.category === key ? 'white' : '#b3b3b3',
                                            fontSize: '14px',
                                            fontWeight: 600
                                        }}>
                                            {cat.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Story-specific fields */}
                    {type === 'story' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>🩺 Diagnosis Type</label>
                                    <select
                                        name="diagnosis_type"
                                        value={formData.diagnosis_type}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, cursor: 'pointer' }}
                                    >
                                        <option value="">Select diagnosis...</option>
                                        {Object.entries(DIAGNOSIS_TYPES).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>📊 Current Status</label>
                                    <select
                                        name="current_status"
                                        value={formData.current_status}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, cursor: 'pointer' }}
                                    >
                                        <option value="">Select status...</option>
                                        {Object.entries(STATUS_OPTIONS).map(([key, val]) => (
                                            <option key={key} value={key}>{val.icon} {val.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>⏱️ Recovery Duration</label>
                                <input
                                    type="text"
                                    name="recovery_duration"
                                    value={formData.recovery_duration}
                                    onChange={handleChange}
                                    placeholder="e.g., 3 months, 1 year, ongoing"
                                    style={inputStyle}
                                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {/* Content */}
                    <div>
                        <label style={labelStyle}>
                            {type === 'post' ? '💭 Details' : '📖 Your Story'} <span style={{ color: '#e50914' }}>*</span>
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder={type === 'post'
                                ? 'Provide more details about your question. The more context you give, the better answers you\'ll receive...'
                                : 'Share your journey - your diagnosis, treatment experience, challenges, and triumphs...'}
                            style={{ ...inputStyle, resize: 'none', minHeight: '140px', lineHeight: 1.6 }}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Story-specific: Treatment & Tips */}
                    {type === 'story' && (
                        <>
                            <div>
                                <label style={labelStyle}>💊 Treatment Summary</label>
                                <textarea
                                    name="treatment_summary"
                                    value={formData.treatment_summary}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Briefly describe your treatment process..."
                                    style={{ ...inputStyle, resize: 'none', minHeight: '100px', lineHeight: 1.6 }}
                                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>💡 Helpful Tips for Others</label>
                                <textarea
                                    name="helpful_tips"
                                    value={formData.helpful_tips}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Any advice you'd give to someone going through a similar experience..."
                                    style={{ ...inputStyle, resize: 'none', minHeight: '100px', lineHeight: 1.6 }}
                                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {/* Submit Buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        marginTop: '8px'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '14px 28px',
                                borderRadius: '12px',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                background: 'transparent',
                                color: '#b3b3b3',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: '14px 28px',
                                borderRadius: '12px',
                                border: 'none',
                                background: isSubmitting
                                    ? 'rgba(229, 9, 20, 0.5)'
                                    : 'linear-gradient(135deg, #e50914 0%, #b20710 100%)',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(229, 9, 20, 0.4)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    {type === 'post' ? '🚀 Post Question' : '✨ Share Story'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePostModal;

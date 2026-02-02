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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                {/* Header */}
                <div className="sticky top-0 bg-[#2a2a2a] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                        {type === 'post' ? '💬 Ask the Community' : '✨ Share Your Story'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#b3b3b3] hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Anonymity Notice */}
                <div className="px-6 py-3 bg-[#46d369]/10 border-b border-[#46d369]/20">
                    <p className="text-[#46d369] text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Your identity is anonymous. A random display name will be used.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-[#ff4757]/10 border border-[#ff4757]/30 rounded-lg p-4 text-[#ff4757] text-sm">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-white font-medium mb-2">
                            {type === 'post' ? 'Question Title' : 'Story Title'} *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder={type === 'post' ? 'What would you like to ask?' : 'Give your story a title'}
                            className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#666] focus:outline-none focus:border-[#e50914] transition-colors"
                        />
                    </div>

                    {/* Category (Posts only) */}
                    {type === 'post' && (
                        <div>
                            <label className="block text-white font-medium mb-2">Category</label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(CATEGORIES).map(([key, cat]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, category: key }))}
                                        className={`p-3 rounded-lg border text-left transition-all ${formData.category === key
                                                ? 'border-[#e50914] bg-[#e50914]/10'
                                                : 'border-white/10 bg-[#1f1f1f] hover:border-white/30'
                                            }`}
                                    >
                                        <span className="text-lg mr-2">{cat.icon}</span>
                                        <span className="text-white text-sm font-medium">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Story-specific fields */}
                    {type === 'story' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white font-medium mb-2">Diagnosis Type</label>
                                    <select
                                        name="diagnosis_type"
                                        value={formData.diagnosis_type}
                                        onChange={handleChange}
                                        className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e50914] transition-colors"
                                    >
                                        <option value="">Select...</option>
                                        {Object.entries(DIAGNOSIS_TYPES).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white font-medium mb-2">Current Status</label>
                                    <select
                                        name="current_status"
                                        value={formData.current_status}
                                        onChange={handleChange}
                                        className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e50914] transition-colors"
                                    >
                                        <option value="">Select...</option>
                                        {Object.entries(STATUS_OPTIONS).map(([key, val]) => (
                                            <option key={key} value={key}>{val.icon} {val.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-2">Recovery Duration</label>
                                <input
                                    type="text"
                                    name="recovery_duration"
                                    value={formData.recovery_duration}
                                    onChange={handleChange}
                                    placeholder="e.g., 3 months, 1 year"
                                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#666] focus:outline-none focus:border-[#e50914] transition-colors"
                                />
                            </div>
                        </>
                    )}

                    {/* Content */}
                    <div>
                        <label className="block text-white font-medium mb-2">
                            {type === 'post' ? 'Details' : 'Your Story'} *
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={6}
                            placeholder={type === 'post'
                                ? 'Provide more details about your question...'
                                : 'Share your journey - your diagnosis, treatment, recovery experience...'}
                            className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#666] focus:outline-none focus:border-[#e50914] transition-colors resize-none"
                        />
                    </div>

                    {/* Story-specific: Treatment & Tips */}
                    {type === 'story' && (
                        <>
                            <div>
                                <label className="block text-white font-medium mb-2">Treatment Summary</label>
                                <textarea
                                    name="treatment_summary"
                                    value={formData.treatment_summary}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Briefly describe your treatment process..."
                                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#666] focus:outline-none focus:border-[#e50914] transition-colors resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-2">💡 Helpful Tips for Others</label>
                                <textarea
                                    name="helpful_tips"
                                    value={formData.helpful_tips}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Any advice you'd give to someone going through a similar experience..."
                                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#666] focus:outline-none focus:border-[#e50914] transition-colors resize-none"
                                />
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary px-6 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary px-6 py-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner w-4 h-4 border-2"></span>
                                    Submitting...
                                </>
                            ) : (
                                type === 'post' ? 'Post Question' : 'Share Story'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePostModal;

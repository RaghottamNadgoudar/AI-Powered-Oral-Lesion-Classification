import { useState } from 'react';
import axios from 'axios';
import ImageUploader from '../components/ImageUploader';
import ResultCard from '../components/ResultCard';

const API_BASE_URL = 'http://localhost:5000/api';

function AnalysisPage() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleImageSelect = (file, preview) => {
        setSelectedImage(file);
        setImagePreview(preview);
        setResult(null);
        setError(null);
    };

    const analyzeImage = async () => {
        if (!selectedImage) {
            setError('Please select an image first');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            const response = await axios.post(`${API_BASE_URL}/classify`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // 60 second timeout
            });

            if (response.data.success) {
                setResult(response.data);
            } else {
                setError(response.data.error || 'Analysis failed');
            }
        } catch (err) {
            console.error('Analysis error:', err);
            if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
                setError('Cannot connect to the server. Please make sure the backend is running on http://localhost:5000');
            } else if (err.response) {
                setError(err.response.data?.error || 'Server error occurred');
            } else {
                setError('An error occurred during analysis. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-6">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[#141414]" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e50914]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e50914]/3 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Oral Lesion <span className="gradient-text">Analysis</span>
                    </h1>
                    <p className="text-[#b3b3b3] max-w-xl mx-auto">
                        Upload an image of an oral lesion to receive AI-powered classification.
                        Our system performs two-level analysis for comprehensive results.
                    </p>
                </div>

                {/* Classification Info */}
                <div className="glass-card p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#e50914] rounded-full" />
                            <span className="text-[#b3b3b3]">Level 1: Healthy vs Unhealthy</span>
                        </div>
                        <div className="w-px h-4 bg-[#333]" />
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#f5c518] rounded-full" />
                            <span className="text-[#b3b3b3]">Level 2: Malignant vs Benign</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {!result ? (
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {/* Image Uploader */}
                        <ImageUploader
                            onImageSelect={handleImageSelect}
                            isLoading={isLoading}
                        />

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 p-4 bg-[#ff4757]/10 border border-[#ff4757]/20 rounded-xl text-center animate-fade-in">
                                <p className="text-[#ff4757]">{error}</p>
                            </div>
                        )}

                        {/* Analyze Button */}
                        {selectedImage && !isLoading && (
                            <div className="mt-8 text-center animate-fade-in">
                                <button
                                    onClick={analyzeImage}
                                    className="btn-primary text-lg px-12 py-4"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        />
                                    </svg>
                                    Analyze Image
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <ResultCard result={result} onReset={handleReset} />
                )}

                {/* Help Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    {[
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            ),
                            title: 'Quality Images',
                            description: 'Use clear, well-lit photos for best results'
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                            title: 'Quick Analysis',
                            description: 'Results are ready in just a few seconds'
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            ),
                            title: 'Secure & Private',
                            description: 'Your images are never stored'
                        }
                    ].map((item, index) => (
                        <div key={index} className="glass-card p-6 text-center hover-lift">
                            <div className="w-12 h-12 bg-[#e50914]/10 rounded-xl flex items-center justify-center text-[#e50914] mx-auto mb-4">
                                {item.icon}
                            </div>
                            <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                            <p className="text-[#666] text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AnalysisPage;

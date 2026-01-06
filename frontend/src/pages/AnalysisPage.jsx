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
                timeout: 60000,
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

    const features = [
        {
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: 'High Quality Images',
            description: 'Clear, well-lit photos ensure optimal accuracy'
        },
        {
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Rapid Analysis',
            description: 'AI-powered results within seconds'
        },
        {
            icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: 'Secure & Private',
            description: 'Your images are never stored'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#0a0a0a' }}>
            {/* Animated background orbs */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '25%',
                    width: '384px',
                    height: '384px',
                    background: 'rgba(229, 9, 20, 0.05)',
                    borderRadius: '50%',
                    filter: 'blur(48px)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '25%',
                    right: '25%',
                    width: '384px',
                    height: '384px',
                    background: 'rgba(229, 9, 20, 0.03)',
                    borderRadius: '50%',
                    filter: 'blur(48px)'
                }}></div>
            </div>

            {/* Spacer for fixed navbar */}
            <div style={{ height: '80px' }}></div>

            {/* Main content wrapper - using flexbox for centering */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                padding: '48px 16px'
            }}>
                {/* Centered container with max width */}
                <div style={{ width: '100%', maxWidth: '896px' }}>

                    {/* Header Section */}
                    {!result && (
                        <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <h1 style={{
                                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                                fontWeight: 'bold',
                                color: 'white',
                                marginBottom: '24px',
                                lineHeight: 1.2
                            }}>
                                Oral Lesion <span className="gradient-text">Analysis</span>
                            </h1>
                            <p style={{
                                fontSize: '1.125rem',
                                color: '#b3b3b3',
                                maxWidth: '640px',
                                margin: '0 auto',
                                lineHeight: 1.6
                            }}>
                                Upload an image to receive AI-powered classification with two-level diagnostic analysis
                            </p>
                        </div>
                    )}

                    {/* Classification Legend */}
                    {!result && (
                        <div className="animate-fadeInUp glass-card" style={{
                            maxWidth: '640px',
                            margin: '0 auto 48px auto',
                            padding: '24px 32px'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '32px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div className="glow-red" style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #e50914, #b20710)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>1</span>
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ color: 'white', fontWeight: 600 }}>Level 1</div>
                                        <div style={{ color: '#666', fontSize: '14px' }}>Healthy vs Unhealthy</div>
                                    </div>
                                </div>

                                <div style={{ width: '1px', height: '48px', background: '#333' }}></div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div className="glow-yellow" style={{
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #f5c518, #c49b00)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>2</span>
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ color: 'white', fontWeight: 600 }}>Level 2</div>
                                        <div style={{ color: '#666', fontSize: '14px' }}>Malignant vs Benign</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Analysis Area */}
                    {!result ? (
                        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                            {/* Image Uploader */}
                            <div className="animate-slideUp" style={{ marginBottom: '32px' }}>
                                <ImageUploader
                                    onImageSelect={handleImageSelect}
                                    isLoading={isLoading}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="animate-shake glass-card" style={{
                                    padding: '24px',
                                    marginBottom: '32px',
                                    border: '1px solid rgba(255, 71, 87, 0.3)',
                                    background: 'rgba(255, 71, 87, 0.1)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                        <div style={{
                                            flexShrink: 0,
                                            width: '40px',
                                            height: '40px',
                                            background: 'rgba(255, 71, 87, 0.2)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <svg style={{ width: '20px', height: '20px', color: '#ff4757' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ color: '#ff4757', fontWeight: 600, marginBottom: '4px' }}>Analysis Error</h4>
                                            <p style={{ color: '#ff9f9f', fontSize: '14px' }}>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Analyze Button */}
                            {selectedImage && !isLoading && (
                                <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: '48px' }}>
                                    <button
                                        onClick={analyzeImage}
                                        className="btn-primary"
                                        style={{ fontSize: '1.125rem', padding: '16px 48px' }}
                                    >
                                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <span>Analyze Image</span>
                                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Features Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '24px',
                                marginTop: '64px'
                            }}>
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="glass-card hover-lift animate-fadeInUp"
                                        style={{ padding: '24px', textAlign: 'center' }}
                                    >
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            background: 'rgba(229, 9, 20, 0.1)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 16px auto',
                                            color: '#e50914'
                                        }}>
                                            {feature.icon}
                                        </div>
                                        <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '8px' }}>{feature.title}</h3>
                                        <p style={{ color: '#666', fontSize: '14px' }}>{feature.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Disclaimer */}
                            <div className="glass-card animate-fadeInUp" style={{
                                marginTop: '48px',
                                padding: '24px',
                                border: '1px solid rgba(245, 197, 24, 0.2)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <svg style={{ width: '20px', height: '20px', color: '#f5c518', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '4px', fontSize: '14px' }}>Medical Disclaimer</h4>
                                        <p style={{ color: '#666', fontSize: '12px', lineHeight: 1.5 }}>
                                            This tool is for research and educational purposes only. Results should not replace professional medical diagnosis. Always consult with a qualified healthcare provider.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fadeInUp">
                            <ResultCard result={result} onReset={handleReset} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnalysisPage;
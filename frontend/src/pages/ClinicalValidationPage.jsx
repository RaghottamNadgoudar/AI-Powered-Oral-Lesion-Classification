import { useState } from 'react';

function ClinicalValidationPage() {
    const [selectedCase, setSelectedCase] = useState(null);

    const caseStudies = [
        {
            id: 1,
            title: 'Case Study #1',
            image: '/case-studies/case1_benign.jpg',
            prediction: 'Benign',
            confidence: 99.2,
            isMalignant: false,
            level1: { classification: 'Unhealthy', confidence: 93.4 },
            level2: { classification: 'Benign', confidence: 99.2 },
            description: 'Oral lesion with benign characteristics detected during field testing.',
            source: 'KIMS Hubballi',
            date: 'January 2026'
        },
        {
            id: 2,
            title: 'Case Study #2',
            image: '/case-studies/case2_benign.jpg',
            prediction: 'Benign',
            confidence: 100.0,
            isMalignant: false,
            level1: { classification: 'Unhealthy', confidence: 72.8 },
            level2: { classification: 'Benign', confidence: 100.0 },
            description: 'Lesion presenting benign features identified by the AI model.',
            source: 'KIMS Hubballi',
            date: 'January 2026'
        },
        {
            id: 3,
            title: 'Case Study #3',
            image: '/case-studies/case3_malignant.jpg',
            prediction: 'Malignant',
            confidence: 97.5,
            isMalignant: true,
            level1: { classification: 'Unhealthy', confidence: 69.3 },
            level2: { classification: 'Malignant', confidence: 97.5 },
            description: 'Advanced lesion flagged by AI as requiring urgent medical attention.',
            source: 'KIMS Hubballi',
            date: 'January 2026'
        },
        {
            id: 4,
            title: 'Case Study #4',
            image: '/case-studies/case4_benign.jpg',
            prediction: 'Benign',
            confidence: 100.0,
            isMalignant: false,
            level1: { classification: 'Unhealthy', confidence: 63.5 },
            level2: { classification: 'Benign', confidence: 100.0 },
            description: 'Tongue lesion with benign characteristics from clinical validation.',
            source: 'Deeksha Dental Clinic, Tumkur',
            date: 'January 2026'
        },
        {
            id: 5,
            title: 'Case Study #5',
            image: '/case-studies/case5_benign.jpg',
            prediction: 'Benign',
            confidence: 99.7,
            isMalignant: false,
            level1: { classification: 'Unhealthy', confidence: 95.2 },
            level2: { classification: 'Benign', confidence: 99.7 },
            description: 'Lower gum lesion presenting benign features during field testing.',
            source: 'Deeksha Dental Clinic, Tumkur',
        },
        {
            id: 6,
            title: 'Case Study #6',
            image: '/case-studies/case6_malignant.png',
            prediction: 'Malignant',
            confidence: 99.8,
            isMalignant: true,
            level1: { classification: 'Unhealthy', confidence: 50.0 },
            level2: { classification: 'Malignant', confidence: 99.8 },
            description: 'Tongue lesion with visible white and red patches, flagged as potentially malignant.',
            source: 'Deeksha Dental Clinic, Tumkur',
            date: 'January 2026'
        },
        {
            id: 7,
            title: 'Case Study #7',
            image: '/case-studies/case7_benign.png',
            prediction: 'Benign',
            confidence: 98.7,
            isMalignant: false,
            level1: { classification: 'Unhealthy', confidence: 50.0 },
            level2: { classification: 'Benign', confidence: 98.7 },
            description: 'Lesion with benign characteristics detected during screening at Deeksha Dental Clinic.',
            source: 'Deeksha Dental Clinic, Tumkur',
            date: 'January 2026'
        }
    ];

    const stats = [
        { label: 'Cases Tested', value: '7', icon: '📊' },
        { label: 'Testing Sources', value: 'KIMS Hubballi & Deeksha Dental Clinic', icon: '🏥' }
    ];

    return (
        <div style={{ minHeight: '100vh', width: '100%', backgroundColor: 'transparent' }}>
            {/* Spacer for fixed navbar */}
            <div style={{ height: '80px' }}></div>

            {/* Main content wrapper */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                padding: '24px 16px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: '48px', width: '100%' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '9999px',
                        marginBottom: '16px'
                    }}>
                        <span style={{ fontSize: '0.875rem', color: '#4ade80', fontWeight: '600' }}>
                            ✓ Field Tested
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '16px',
                        lineHeight: 1.2
                    }}>
                        Clinical <span className="gradient-text">Validation</span>
                    </h1>
                    <p style={{
                        fontSize: '1.125rem',
                        color: '#b3b3b3',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Real-world test results from KIMS Hubballi demonstrating AI accuracy on actual patient cases
                    </p>
                </div>

                {/* Statistics Grid */}
                <div className="animate-fadeInUp" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    width: '100%',
                    marginBottom: '48px'
                }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="glass-card" style={{
                            padding: '24px',
                            textAlign: 'center',
                            border: '1px solid #333'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Case Studies Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px',
                    width: '100%',
                    marginBottom: '48px'
                }}>
                    {caseStudies.map((caseStudy, index) => (
                        <div
                            key={caseStudy.id}
                            className="glass-card animate-fadeInUp"
                            style={{
                                padding: '0',
                                overflow: 'hidden',
                                border: `1px solid ${caseStudy.isMalignant ? 'rgba(239, 68, 68, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                animationDelay: `${index * 0.1}s`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 8px 30px ${caseStudy.isMalignant ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)'}`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            onClick={() => setSelectedCase(caseStudy)}
                        >
                            {/* Image */}
                            <div style={{
                                width: '100%',
                                height: '240px',
                                overflow: 'hidden',
                                background: '#1a1a1a',
                                position: 'relative'
                            }}>
                                <img
                                    src={caseStudy.image}
                                    alt={caseStudy.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                {/* Prediction Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    padding: '6px 12px',
                                    background: caseStudy.isMalignant ? '#ef4444' : '#eab308',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: 'white'
                                }}>
                                    {caseStudy.prediction}
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '24px' }}>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginBottom: '8px'
                                }}>
                                    {caseStudy.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#9ca3af',
                                    lineHeight: 1.6,
                                    marginBottom: '16px'
                                }}>
                                    {caseStudy.description}
                                </p>

                                {/* Confidence Bar */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px'
                                    }}>
                                        <span style={{ fontSize: '0.75rem', color: '#666' }}>AI Confidence</span>
                                        <span style={{ fontSize: '0.75rem', color: 'white', fontWeight: '600' }}>
                                            {caseStudy.confidence}%
                                        </span>
                                    </div>
                                    <div style={{
                                        height: '6px',
                                        background: '#1f1f1f',
                                        borderRadius: '9999px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${caseStudy.confidence}%`,
                                            background: caseStudy.isMalignant ? '#ef4444' : '#eab308',
                                            borderRadius: '9999px',
                                            transition: 'width 1s ease-out'
                                        }} />
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: '#666',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #333'
                                }}>
                                    <span>🏥 {caseStudy.source}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="glass-card animate-fadeInUp" style={{
                    maxWidth: '800px',
                    width: '100%',
                    padding: '24px',
                    border: '1px solid rgba(234, 179, 8, 0.2)',
                    background: 'rgba(234, 179, 8, 0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <svg style={{ width: '24px', height: '24px', color: '#eab308', flexShrink: 0, marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#facc15', marginBottom: '8px' }}>
                                Medical Disclaimer
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: '#d1d5db', lineHeight: 1.6 }}>
                                These case studies demonstrate the AI model's performance on real clinical data from KIMS Hubballi and Deeksha Dental Clinic, Tumkur.
                                This tool is designed as a diagnostic aid and should not replace professional medical evaluation.
                                All predictions should be verified by qualified healthcare professionals. Patient privacy has been
                                maintained in accordance with medical ethics guidelines.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for expanded view */}
            {selectedCase && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px'
                    }}
                    onClick={() => setSelectedCase(null)}
                >
                    <div
                        className="glass-card"
                        style={{
                            maxWidth: '900px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            padding: '32px',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedCase(null)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: '#333',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white'
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>
                            {selectedCase.title}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <img
                                    src={selectedCase.image}
                                    alt={selectedCase.title}
                                    style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        marginBottom: '16px'
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '1rem', color: '#9ca3af', marginBottom: '8px' }}>Level 1: Health Status</h3>
                                    <div style={{
                                        padding: '12px',
                                        background: '#1a1a1a',
                                        borderRadius: '8px',
                                        border: '1px solid #333'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: 'white' }}>{selectedCase.level1.classification}</span>
                                            <span style={{ color: '#ef4444', fontWeight: '600' }}>{selectedCase.level1.confidence}%</span>
                                        </div>
                                        <div style={{ height: '4px', background: '#0f0f0f', borderRadius: '9999px' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${selectedCase.level1.confidence}%`,
                                                background: '#ef4444',
                                                borderRadius: '9999px'
                                            }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '1rem', color: '#9ca3af', marginBottom: '8px' }}>Level 2: Classification</h3>
                                    <div style={{
                                        padding: '12px',
                                        background: '#1a1a1a',
                                        borderRadius: '8px',
                                        border: '1px solid #333'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: 'white' }}>{selectedCase.level2.classification}</span>
                                            <span style={{
                                                color: selectedCase.isMalignant ? '#ef4444' : '#eab308',
                                                fontWeight: '600'
                                            }}>
                                                {selectedCase.level2.confidence}%
                                            </span>
                                        </div>
                                        <div style={{ height: '4px', background: '#0f0f0f', borderRadius: '9999px' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${selectedCase.level2.confidence}%`,
                                                background: selectedCase.isMalignant ? '#ef4444' : '#eab308',
                                                borderRadius: '9999px'
                                            }} />
                                        </div>
                                    </div>
                                </div>

                                <p style={{ color: '#d1d5db', lineHeight: 1.6, marginBottom: '16px' }}>
                                    {selectedCase.description}
                                </p>

                                <div style={{
                                    padding: '16px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: '#60a5fa' }}>
                                        📍 Source: <strong>{selectedCase.source}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClinicalValidationPage;

import { useState, useEffect } from 'react';
import { generateOralHealthSuggestions } from '../services/geminiService';
import { generateMedicalReport } from '../utils/reportGenerator';

function ResultCard({ result, onReset }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(true);
    const [downloadingReport, setDownloadingReport] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (result) {
                setLoadingSuggestions(true);
                try {
                    const aiSuggestions = await generateOralHealthSuggestions(result);
                    setSuggestions(aiSuggestions);
                } catch (error) {
                    console.error('Failed to get suggestions:', error);
                    setSuggestions([]);
                }
                setLoadingSuggestions(false);
            }
        };

        fetchSuggestions();
    }, [result]);

    if (!result) return null;

    const getResultConfig = () => {
        if (result.level1?.is_healthy) {
            return {
                title: 'Healthy',
                subtitle: 'No concerning lesions detected',
                icon: '✓',
                iconBg: '#22c55e',
                gradientFrom: 'rgba(34, 197, 94, 0.2)',
                gradientTo: 'rgba(34, 197, 94, 0.05)',
                borderColor: 'rgba(34, 197, 94, 0.3)',
                textColor: '#4ade80',
                description: 'The analysis indicates that the oral tissue appears healthy with no signs of concerning lesions.',
                recommendation: 'Continue regular dental check-ups and maintain good oral hygiene.'
            };
        } else if (result.level2?.classification === 'benign') {
            return {
                title: 'Benign Lesion',
                subtitle: 'Non-cancerous lesion detected',
                icon: '!',
                iconBg: '#eab308',
                gradientFrom: 'rgba(234, 179, 8, 0.2)',
                gradientTo: 'rgba(234, 179, 8, 0.05)',
                borderColor: 'rgba(234, 179, 8, 0.3)',
                textColor: '#facc15',
                description: 'The analysis detected a lesion that appears to be benign (non-cancerous).',
                recommendation: 'While likely not serious, we recommend consulting a dental professional for proper evaluation.'
            };
        } else if (result.level2?.classification === 'malignant') {
            return {
                title: 'Potential Malignant Lesion',
                subtitle: 'Urgent attention recommended',
                icon: '⚠',
                iconBg: '#ef4444',
                gradientFrom: 'rgba(239, 68, 68, 0.2)',
                gradientTo: 'rgba(239, 68, 68, 0.05)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                textColor: '#f87171',
                description: 'The analysis detected a lesion with characteristics that require immediate medical attention.',
                recommendation: 'Please consult an oral surgeon or oncologist as soon as possible for further evaluation.'
            };
        }

        return {
            title: 'Analysis Complete',
            subtitle: 'Results available',
            icon: 'i',
            iconBg: '#6b7280',
            gradientFrom: 'rgba(107, 114, 128, 0.2)',
            gradientTo: 'rgba(107, 114, 128, 0.05)',
            borderColor: 'rgba(107, 114, 128, 0.3)',
            textColor: '#9ca3af',
            description: 'The analysis has been completed.',
            recommendation: 'Please review the results below.'
        };
    };

    const handleDownloadReport = async () => {
        setDownloadingReport(true);
        try {
            await generateMedicalReport(result, suggestions);
        } catch (error) {
            console.error('Failed to generate report:', error);
        }
        setDownloadingReport(false);
    };

    const config = getResultConfig();

    return (
        <div style={{
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 16px'
        }}>
            {/* Main Result Card - Bento Style */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(15,15,15,0.9), rgba(26,26,26,0.9))',
                border: `1px solid ${config.borderColor}`,
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '24px',
                boxShadow: `0 0 40px ${config.gradientFrom}`
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: config.iconBg,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        color: 'white',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        boxShadow: `0 8px 30px ${config.gradientFrom}`
                    }}>
                        {config.icon}
                    </div>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: config.textColor,
                        marginBottom: '8px'
                    }}>
                        {config.title}
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '1rem' }}>{config.subtitle}</p>
                </div>

                {/* Bento Grid - Confidence Scores */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: result.level2 && !result.level2.error ? '1fr 1fr' : '1fr',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    {/* Level 1 Result */}
                    <div style={{
                        background: 'rgba(15, 15, 15, 0.8)',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1px solid #333'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px'
                        }}>
                            <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500' }}>Level 1 Analysis</span>
                            <span style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: result.level1?.is_healthy ? '#4ade80' : '#f87171'
                            }}>
                                {result.level1?.classification || 'N/A'}
                            </span>
                        </div>
                        <div style={{
                            height: '8px',
                            background: '#1f1f1f',
                            borderRadius: '9999px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${result.level1?.confidence || 0}%`,
                                background: result.level1?.is_healthy ? '#22c55e' : '#ef4444',
                                borderRadius: '9999px',
                                transition: 'width 1s ease-out'
                            }} />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '8px' }}>
                            Confidence: {result.level1?.confidence?.toFixed(1) || 0}%
                        </p>
                    </div>

                    {/* Level 2 Result (if applicable) */}
                    {result.level2 && !result.level2.error && (
                        <div style={{
                            background: 'rgba(15, 15, 15, 0.8)',
                            borderRadius: '16px',
                            padding: '20px',
                            border: '1px solid #333'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '12px'
                            }}>
                                <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: '500' }}>Level 2 Analysis</span>
                                <span style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: result.level2?.is_malignant ? '#f87171' : '#facc15'
                                }}>
                                    {result.level2?.classification || 'N/A'}
                                </span>
                            </div>
                            <div style={{
                                height: '8px',
                                background: '#1f1f1f',
                                borderRadius: '9999px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${result.level2?.confidence || 0}%`,
                                    background: result.level2?.is_malignant ? '#ef4444' : '#eab308',
                                    borderRadius: '9999px',
                                    transition: 'width 1s ease-out'
                                }} />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '8px' }}>
                                Confidence: {result.level2?.confidence?.toFixed(1) || 0}%
                            </p>
                        </div>
                    )}
                </div>

                {/* Analysis Summary */}
                <div style={{
                    background: 'rgba(15, 15, 15, 0.8)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    border: '1px solid #333'
                }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
                        Analysis Summary
                    </h3>
                    <p style={{ color: '#d1d5db', lineHeight: 1.7, marginBottom: '16px', fontSize: '0.9375rem' }}>
                        {config.description}
                    </p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '16px',
                        background: 'rgba(229, 9, 20, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(229, 9, 20, 0.2)'
                    }}>
                        <svg style={{ width: '20px', height: '20px', color: '#e50914', flexShrink: 0, marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p style={{ fontSize: '0.875rem', color: '#fca5a5' }}>
                            <span style={{ fontWeight: '600' }}>Recommendation:</span> {config.recommendation}
                        </p>
                    </div>
                </div>

                {/* AI Suggestions - Bento Grid */}
                <div style={{
                    background: 'rgba(15, 15, 15, 0.8)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid #333'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>AI Health Suggestions</h3>
                        {loadingSuggestions && (
                            <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid rgba(59, 130, 246, 0.3)',
                                borderTopColor: '#3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                        )}
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px'
                    }}>
                        {loadingSuggestions ? (
                            [1, 2, 3, 4].map((i) => (
                                <div key={i} style={{
                                    background: '#1a1a1a',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    border: '1px solid #333'
                                }}>
                                    <div style={{ height: '16px', background: '#333', borderRadius: '4px', width: '60%', marginBottom: '8px' }} />
                                    <div style={{ height: '12px', background: '#2a2a2a', borderRadius: '4px', width: '90%' }} />
                                </div>
                            ))
                        ) : (
                            suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    style={{
                                        background: '#1a1a1a',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        border: '1px solid #333',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#555';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#333';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <h4 style={{ color: 'white', fontWeight: '500', fontSize: '0.9375rem', marginBottom: '6px' }}>
                                        {suggestion.title}
                                    </h4>
                                    <p style={{ color: '#9ca3af', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                                        {suggestion.description}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div style={{
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
            }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(253, 224, 71, 0.8)', textAlign: 'center', lineHeight: 1.6 }}>
                    ⚠️ This AI analysis is for educational purposes only and should not be used as a substitute for professional medical diagnosis.
                    Always consult with a qualified healthcare provider for proper evaluation.
                </p>
            </div>

            {/* Action Buttons */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center'
            }}>
                <button
                    onClick={onReset}
                    style={{
                        background: '#e50914',
                        color: 'white',
                        fontWeight: '600',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9375rem',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f40612';
                        e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#e50914';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Analyze Another Image
                </button>
                <button
                    onClick={handleDownloadReport}
                    disabled={downloadingReport || loadingSuggestions}
                    style={{
                        background: '#2a2a2a',
                        color: 'white',
                        fontWeight: '600',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        border: '1px solid #444',
                        cursor: downloadingReport || loadingSuggestions ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9375rem',
                        opacity: downloadingReport || loadingSuggestions ? 0.5 : 1,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (!downloadingReport && !loadingSuggestions) {
                            e.currentTarget.style.background = '#333';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#2a2a2a';
                    }}
                >
                    {downloadingReport ? (
                        <>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTopColor: 'white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Report
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ResultCard;

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
                bgGradient: 'from-green-600 to-green-700',
                borderColor: 'border-green-500/30',
                textColor: 'text-green-400',
                iconBg: 'bg-green-500',
                description: 'The analysis indicates that the oral tissue appears healthy with no signs of concerning lesions.',
                recommendation: 'Continue regular dental check-ups and maintain good oral hygiene.'
            };
        } else if (result.level2?.classification === 'benign') {
            return {
                title: 'Benign Lesion',
                subtitle: 'Non-cancerous lesion detected',
                icon: '!',
                bgGradient: 'from-yellow-600 to-yellow-700',
                borderColor: 'border-yellow-500/30',
                textColor: 'text-yellow-400',
                iconBg: 'bg-yellow-500',
                description: 'The analysis detected a lesion that appears to be benign (non-cancerous).',
                recommendation: 'While likely not serious, we recommend consulting a dental professional for proper evaluation.'
            };
        } else if (result.level2?.classification === 'malignant') {
            return {
                title: 'Potential Malignant Lesion',
                subtitle: 'Urgent attention recommended',
                icon: '⚠',
                bgGradient: 'from-red-600 to-red-700',
                borderColor: 'border-red-500/30',
                textColor: 'text-red-400',
                iconBg: 'bg-red-500',
                description: 'The analysis detected a lesion with characteristics that require immediate medical attention.',
                recommendation: 'Please consult an oral surgeon or oncologist as soon as possible for further evaluation.'
            };
        }

        return {
            title: 'Analysis Complete',
            subtitle: 'Results available',
            icon: 'i',
            bgGradient: 'from-gray-600 to-gray-700',
            borderColor: 'border-gray-500/30',
            textColor: 'text-gray-400',
            iconBg: 'bg-gray-500',
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
        <div className="max-w-3xl mx-auto px-4">
            {/* Main Result Card */}
            <div className={`bg-[#1a1a1a] border ${config.borderColor} rounded-2xl p-8 mb-10`}>
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-4 mb-10">
                    <div className={`w-16 h-16 ${config.iconBg} rounded-xl flex items-center justify-center text-2xl text-white font-bold shadow-lg`}>
                        {config.icon}
                    </div>
                    <div>
                        <h2 className={`text-3xl font-bold ${config.textColor} mb-2`}>
                            {config.title}
                        </h2>
                        <p className="text-gray-400">{config.subtitle}</p>
                    </div>
                </div>

                {/* Confidence Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Level 1 Result */}
                    <div className="bg-[#0f0f0f] rounded-xl p-5 border border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-400 font-medium">Level 1 Analysis</span>
                            <span className={`text-sm font-semibold ${result.level1?.is_healthy ? 'text-green-400' : 'text-red-400'}`}>
                                {result.level1?.classification || 'N/A'}
                            </span>
                        </div>
                        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${result.level1?.is_healthy ? 'bg-green-500' : 'bg-red-500'} rounded-full transition-all duration-1000`}
                                style={{ width: `${result.level1?.confidence || 0}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Confidence: {result.level1?.confidence?.toFixed(1) || 0}%
                        </p>
                    </div>

                    {/* Level 2 Result (if applicable) */}
                    {result.level2 && !result.level2.error && (
                        <div className="bg-[#0f0f0f] rounded-xl p-5 border border-gray-800">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-400 font-medium">Level 2 Analysis</span>
                                <span className={`text-sm font-semibold ${result.level2?.is_malignant ? 'text-red-400' : 'text-yellow-400'}`}>
                                    {result.level2?.classification || 'N/A'}
                                </span>
                            </div>
                            <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${result.level2?.is_malignant ? 'bg-red-500' : 'bg-yellow-500'} rounded-full transition-all duration-1000`}
                                    style={{ width: `${result.level2?.confidence || 0}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Confidence: {result.level2?.confidence?.toFixed(1) || 0}%
                            </p>
                        </div>
                    )}
                </div>

                {/* Analysis Summary */}
                <div className="bg-[#0f0f0f] rounded-xl p-6 mb-8 border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-3">Analysis Summary</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        {config.description}
                    </p>
                    <div className="flex items-start gap-3 p-4 bg-[#e50914]/10 rounded-lg border border-[#e50914]/20">
                        <svg className="w-5 h-5 text-[#e50914] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-red-300">
                            <span className="font-semibold">Recommendation:</span> {config.recommendation}
                        </p>
                    </div>
                </div>

                {/* AI Suggestions */}
                <div className="bg-[#0f0f0f] rounded-xl p-6 border border-gray-800 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">AI Health Suggestions</h3>
                        {loadingSuggestions && (
                            <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        )}
                    </div>

                    {loadingSuggestions ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-[#1a1a1a] rounded-lg p-5 animate-pulse border border-gray-800">
                                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-3 mx-auto"></div>
                                    <div className="h-3 bg-gray-800 rounded w-3/4 mx-auto"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="bg-[#1a1a1a] rounded-lg p-5 border border-gray-800 hover:border-gray-600 transition-colors text-left"
                                >
                                    <h4 className="text-white font-medium text-sm mb-2">
                                        {suggestion.title}
                                    </h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">
                                        {suggestion.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-900/20 border border-yellow-600/20 rounded-xl p-5 mb-8">
                <p className="text-xs text-yellow-200/70 text-center leading-relaxed">
                    ⚠️ This AI analysis is for educational purposes only and should not be used as a substitute for professional medical diagnosis.
                    Always consult with a qualified healthcare provider for proper evaluation.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onReset}
                    className="bg-[#e50914] hover:bg-[#f40612] text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Analyze Another Image
                </button>
                <button
                    onClick={handleDownloadReport}
                    disabled={downloadingReport || loadingSuggestions}
                    className="bg-[#2a2a2a] hover:bg-[#333] text-white font-semibold px-8 py-3.5 rounded-xl border border-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {downloadingReport ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

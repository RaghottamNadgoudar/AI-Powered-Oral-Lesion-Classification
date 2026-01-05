function ResultCard({ result, onReset }) {
    if (!result) return null;

    const getResultConfig = () => {
        if (result.level1?.is_healthy) {
            return {
                title: 'Healthy',
                subtitle: 'No concerning lesions detected',
                icon: '✓',
                colorClass: 'result-healthy',
                textColor: 'text-[#46d369]',
                bgColor: 'bg-[#46d369]',
                description: 'The analysis indicates that the oral tissue appears healthy with no signs of concerning lesions.',
                recommendation: 'Continue regular dental check-ups and maintain good oral hygiene.'
            };
        } else if (result.level2?.classification === 'benign') {
            return {
                title: 'Benign Lesion',
                subtitle: 'Non-cancerous lesion detected',
                icon: '!',
                colorClass: 'result-benign',
                textColor: 'text-[#f5c518]',
                bgColor: 'bg-[#f5c518]',
                description: 'The analysis detected a lesion that appears to be benign (non-cancerous).',
                recommendation: 'While likely not serious, we recommend consulting a dental professional for proper evaluation.'
            };
        } else if (result.level2?.classification === 'malignant') {
            return {
                title: 'Potential Malignant Lesion',
                subtitle: 'Urgent attention recommended',
                icon: '⚠',
                colorClass: 'result-malignant',
                textColor: 'text-[#ff4757]',
                bgColor: 'bg-[#ff4757]',
                description: 'The analysis detected a lesion with characteristics that require immediate medical attention.',
                recommendation: 'Please consult an oral surgeon or oncologist as soon as possible for further evaluation.'
            };
        }

        return {
            title: 'Analysis Complete',
            subtitle: 'Results available',
            icon: 'i',
            colorClass: 'glass-card',
            textColor: 'text-white',
            bgColor: 'bg-[#e50914]',
            description: 'The analysis has been completed.',
            recommendation: 'Please review the results below.'
        };
    };

    const config = getResultConfig();

    return (
        <div className={`${config.colorClass} rounded-2xl p-8 animate-fade-in max-w-2xl mx-auto`}>
            {/* Header */}
            <div className="flex items-start gap-6 mb-8">
                <div className={`w-16 h-16 ${config.bgColor} rounded-2xl flex items-center justify-center text-2xl text-white font-bold shadow-lg`}>
                    {config.icon}
                </div>
                <div className="flex-1">
                    <h2 className={`text-3xl font-bold ${config.textColor} mb-1`}>
                        {config.title}
                    </h2>
                    <p className="text-[#b3b3b3]">{config.subtitle}</p>
                </div>
            </div>

            {/* Confidence Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Level 1 Result */}
                <div className="bg-black/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#b3b3b3]">Level 1 Analysis</span>
                        <span className={`text-sm font-medium ${result.level1?.is_healthy ? 'text-[#46d369]' : 'text-[#ff4757]'}`}>
                            {result.level1?.classification || 'N/A'}
                        </span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${result.level1?.is_healthy ? 'bg-[#46d369]' : 'bg-[#ff4757]'} rounded-full transition-all duration-1000`}
                            style={{ width: `${result.level1?.confidence || 0}%` }}
                        />
                    </div>
                    <p className="text-xs text-[#666] mt-2">
                        Confidence: {result.level1?.confidence?.toFixed(1) || 0}%
                    </p>
                </div>

                {/* Level 2 Result (if applicable) */}
                {result.level2 && !result.level2.error && (
                    <div className="bg-black/20 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#b3b3b3]">Level 2 Analysis</span>
                            <span className={`text-sm font-medium ${result.level2?.is_malignant ? 'text-[#ff4757]' : 'text-[#f5c518]'}`}>
                                {result.level2?.classification || 'N/A'}
                            </span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${result.level2?.is_malignant ? 'bg-[#ff4757]' : 'bg-[#f5c518]'} rounded-full transition-all duration-1000`}
                                style={{ width: `${result.level2?.confidence || 0}%` }}
                            />
                        </div>
                        <p className="text-xs text-[#666] mt-2">
                            Confidence: {result.level2?.confidence?.toFixed(1) || 0}%
                        </p>
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="bg-black/20 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Analysis Summary</h3>
                <p className="text-[#b3b3b3] leading-relaxed mb-4">
                    {config.description}
                </p>
                <div className="flex items-start gap-3 p-4 bg-[#e50914]/10 rounded-lg border border-[#e50914]/20">
                    <svg
                        className="w-5 h-5 text-[#e50914] mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-sm text-[#e50914]">
                        <span className="font-semibold">Recommendation:</span> {config.recommendation}
                    </p>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="text-center mb-6">
                <p className="text-xs text-[#666] leading-relaxed">
                    ⚠️ This AI analysis is for educational purposes only and should not be used as a substitute for professional medical diagnosis.
                    Always consult with a qualified healthcare provider for proper evaluation.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onReset}
                    className="btn-primary"
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
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    Analyze Another Image
                </button>
                <button className="btn-secondary">
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
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    Download Report
                </button>
            </div>
        </div>
    );
}

export default ResultCard;

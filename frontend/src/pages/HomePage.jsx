import { Link } from 'react-router-dom';

function HomePage() {
    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Two-Level Analysis',
            description: 'Advanced classification that first determines healthy vs unhealthy, then identifies malignant or benign lesions.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Instant Results',
            description: 'Get comprehensive analysis results within seconds using our optimized AI models.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            title: 'Privacy First',
            description: 'Your images are processed securely and never stored on our servers after analysis.'
        }
    ];

    const stats = [
        { value: '95%+', label: 'Accuracy Rate' },
        { value: '< 5s', label: 'Analysis Time' },
        { value: '2-Level', label: 'Classification' },
        { value: '24/7', label: 'Availability' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 hero-gradient" />

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e50914]/10 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e50914]/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-24">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#e50914]/10 border border-[#e50914]/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
                        <span className="w-2 h-2 bg-[#e50914] rounded-full animate-pulse" />
                        <span className="text-sm text-[#e50914] font-medium">AI-Powered Oral Health Analysis</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Detect Oral Lesions with
                        <span className="block gradient-text">Advanced AI Technology</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-[#b3b3b3] max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Upload an image of an oral lesion and get instant analysis powered by machine learning.
                        Our two-level classification system helps identify potential health concerns.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <Link to="/analysis" className="btn-primary text-lg px-8 py-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Start Analysis
                        </Link>
                        <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
                            Learn More
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-[#666]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-[#b3b3b3] max-w-2xl mx-auto">
                            Our advanced AI system uses a two-level classification approach for accurate lesion analysis.
                        </p>
                    </div>

                    {/* Process Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                step: '01',
                                title: 'Upload Image',
                                description: 'Drag and drop or select an image of the oral lesion you want to analyze.'
                            },
                            {
                                step: '02',
                                title: 'AI Analysis',
                                description: 'Our two-level AI model analyzes the image - first for health status, then for lesion type.'
                            },
                            {
                                step: '03',
                                title: 'Get Results',
                                description: 'Receive detailed classification results with confidence scores and recommendations.'
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="glass-card p-8 hover-lift relative overflow-hidden group"
                            >
                                {/* Step Number */}
                                <div className="absolute top-4 right-4 text-6xl font-bold text-white/5 group-hover:text-[#e50914]/10 transition-colors">
                                    {item.step}
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-[#e50914] rounded-xl flex items-center justify-center text-white font-bold text-lg mb-6">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-[#b3b3b3]">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Classification Flow Diagram */}
                    <div className="glass-card p-8">
                        <h3 className="text-2xl font-bold text-white text-center mb-8">Classification Flow</h3>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            <div className="bg-[#2a2a2a] px-6 py-4 rounded-xl text-center">
                                <div className="text-sm text-[#666] mb-1">Input</div>
                                <div className="text-white font-medium">Image Upload</div>
                            </div>

                            <svg className="w-8 h-8 text-[#e50914] rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>

                            <div className="bg-[#e50914]/20 border border-[#e50914]/30 px-6 py-4 rounded-xl text-center">
                                <div className="text-sm text-[#e50914] mb-1">Level 1</div>
                                <div className="text-white font-medium">Healthy / Unhealthy</div>
                            </div>

                            <svg className="w-8 h-8 text-[#e50914] rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>

                            <div className="bg-[#f5c518]/20 border border-[#f5c518]/30 px-6 py-4 rounded-xl text-center">
                                <div className="text-sm text-[#f5c518] mb-1">Level 2 (if unhealthy)</div>
                                <div className="text-white font-medium">Malignant / Benign</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-transparent via-[#1a1a1a] to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Why Choose OralScan AI</h2>
                        <p className="text-[#b3b3b3] max-w-2xl mx-auto">
                            Our platform combines cutting-edge AI technology with user-friendly design to provide accurate oral lesion analysis.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card p-8 hover-lift group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-[#b3b3b3]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="glass-card p-12 glow-red">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Ready to Analyze?
                        </h2>
                        <p className="text-[#b3b3b3] mb-8 max-w-xl mx-auto">
                            Upload your first image and experience the power of AI-driven oral lesion classification.
                        </p>
                        <Link to="/analysis" className="btn-primary text-lg px-10 py-4">
                            Start Free Analysis
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="about" className="border-t border-[#2a2a2a] py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">
                                Oral<span className="text-[#e50914]">Scan</span> AI
                            </span>
                        </div>

                        <p className="text-sm text-[#666] text-center">
                            © 2024 OralScan AI. For educational purposes only. Not a substitute for professional medical advice.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;

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
        <div style={{ minHeight: '100vh', width: '100%' }}>
            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: '72rem',
                    margin: '0 auto',
                    padding: '7rem 2rem 2rem',
                    textAlign: 'center'
                }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        backgroundColor: 'rgba(229, 9, 20, 0.1)',
                        border: '1px solid rgba(229, 9, 20, 0.2)',
                        borderRadius: '9999px',
                        padding: '0.625rem 1.25rem',
                        marginBottom: '2.5rem'
                    }} className="animate-fade-in">
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#e50914', borderRadius: '50%' }} className="animate-pulse" />
                        <span style={{ fontSize: '0.875rem', color: '#e50914', fontWeight: '500' }}>AI-Powered Oral Health Analysis</span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '2rem',
                        lineHeight: 1.1
                    }} className="animate-fade-in">
                        Detect Oral Lesions with
                        <span className="gradient-text" style={{ display: 'block' }}>Advanced AI Technology</span>
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#b3b3b3',
                        maxWidth: '42rem',
                        margin: '0 auto 3rem',
                        lineHeight: 1.6
                    }} className="animate-fade-in">
                        Upload an image of an oral lesion and get instant analysis powered by machine learning.
                        Our two-level classification system helps identify potential health concerns.
                    </p>

                    {/* CTA Buttons */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        justifyContent: 'center'
                    }} className="animate-fade-in">
                        <Link to="/analysis" className="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Start Analysis
                        </Link>
                        <a href="#how-it-works" className="btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                            Learn More
                        </a>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2.5rem',
                        marginTop: '6rem',
                        maxWidth: '48rem',
                        margin: '6rem auto 0'
                    }} className="animate-fade-in">
                        {stats.map((stat, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>{stat.value}</div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)'
                }} className="animate-bounce">
                    <svg style={{ width: '24px', height: '24px', color: '#666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" style={{ padding: '8rem 2rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>How It Works</h2>
                        <p style={{ color: '#b3b3b3', maxWidth: '42rem', margin: '0 auto', fontSize: '1.125rem' }}>
                            Our advanced AI system uses a two-level classification approach for accurate lesion analysis.
                        </p>
                    </div>

                    {/* Process Steps */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2.5rem',
                        marginBottom: '5rem'
                    }}>
                        {[
                            { step: '01', title: 'Upload Image', description: 'Drag and drop or select an image of the oral lesion you want to analyze.' },
                            { step: '02', title: 'AI Analysis', description: 'Our two-level AI model analyzes the image - first for health status, then for lesion type.' },
                            { step: '03', title: 'Get Results', description: 'Receive detailed classification results with confidence scores and recommendations.' }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="glass-card hover-lift"
                                style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}
                            >
                                {/* Step Number Background */}
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    fontSize: '4rem',
                                    fontWeight: 'bold',
                                    color: 'rgba(255,255,255,0.05)'
                                }}>
                                    {item.step}
                                </div>

                                {/* Content */}
                                <div style={{ position: 'relative', zIndex: 10 }}>
                                    <div style={{
                                        width: '3.5rem',
                                        height: '3.5rem',
                                        background: '#e50914',
                                        borderRadius: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1.125rem',
                                        marginBottom: '2rem'
                                    }}>
                                        {item.step}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>{item.title}</h3>
                                    <p style={{ color: '#b3b3b3' }}>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Classification Flow Diagram */}
                    <div className="glass-card" style={{ padding: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: '2.5rem' }}>Classification Flow</h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1.5rem'
                        }}>
                            <div style={{ background: '#2a2a2a', padding: '1.25rem 2rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>Input</div>
                                <div style={{ color: 'white', fontWeight: '500' }}>Image Upload</div>
                            </div>

                            <svg style={{ width: '2rem', height: '2rem', color: '#e50914', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>

                            <div style={{ background: 'rgba(229, 9, 20, 0.2)', border: '1px solid rgba(229, 9, 20, 0.3)', padding: '1.25rem 2rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#e50914', marginBottom: '0.5rem' }}>Level 1</div>
                                <div style={{ color: 'white', fontWeight: '500' }}>Healthy / Unhealthy</div>
                            </div>

                            <svg style={{ width: '2rem', height: '2rem', color: '#e50914', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>

                            <div style={{ background: 'rgba(245, 197, 24, 0.2)', border: '1px solid rgba(245, 197, 24, 0.3)', padding: '1.25rem 2rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#f5c518', marginBottom: '0.5rem' }}>Level 2 (if unhealthy)</div>
                                <div style={{ color: 'white', fontWeight: '500' }}>Malignant / Benign</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '8rem 2rem', background: 'linear-gradient(to bottom, transparent, rgba(26,26,26,0.5), transparent)' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>Why Choose OralScan AI</h2>
                        <p style={{ color: '#b3b3b3', maxWidth: '42rem', margin: '0 auto', fontSize: '1.125rem' }}>
                            Our platform combines cutting-edge AI technology with user-friendly design to provide accurate oral lesion analysis.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card hover-lift"
                                style={{ padding: '2.5rem', textAlign: 'center' }}
                            >
                                <div style={{
                                    width: '4rem',
                                    height: '4rem',
                                    background: 'linear-gradient(135deg, #e50914, #b20710)',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    marginBottom: '2rem',
                                    margin: '0 auto 2rem'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>{feature.title}</h3>
                                <p style={{ color: '#b3b3b3' }}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '8rem 2rem' }}>
                <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
                    <div className="glass-card glow-red" style={{ padding: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
                            Ready to Analyze?
                        </h2>
                        <p style={{ color: '#b3b3b3', marginBottom: '2.5rem', maxWidth: '32rem', margin: '0 auto 2.5rem', fontSize: '1.125rem' }}>
                            Upload your first image and experience the power of AI-driven oral lesion classification.
                        </p>
                        <Link to="/analysis" className="btn-primary" style={{ fontSize: '1.125rem', padding: '1.25rem 3rem' }}>
                            Start Free Analysis
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #2a2a2a', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                background: 'linear-gradient(135deg, #e50914, #b20710)',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>
                                Oral<span style={{ color: '#e50914' }}>Scan</span> AI
                            </span>
                        </div>

                        <p style={{ fontSize: '0.875rem', color: '#666', textAlign: 'center' }}>
                            © 2024 OralScan AI. For educational purposes only. Not a substitute for professional medical advice.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;

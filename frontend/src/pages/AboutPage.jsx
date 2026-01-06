function AboutPage() {
    const techStack = [
        { name: 'React', description: 'Frontend UI framework', icon: '⚛️' },
        { name: 'Flask', description: 'Backend API server', icon: '🐍' },
        { name: 'CLIP Model', description: 'OpenAI vision-language model', icon: '🧠' },
        { name: 'Gemini AI', description: 'Health suggestions generation', icon: '✨' },
        { name: 'OGL (WebGL)', description: 'Animated background rendering', icon: '🎨' }
    ];

    const classificationDetails = [
        {
            level: 1,
            title: 'Healthy vs Unhealthy',
            description: 'The first classification determines whether the oral tissue appears healthy or shows signs of abnormality.',
            accuracy: '~95%'
        },
        {
            level: 2,
            title: 'Malignant vs Benign',
            description: 'If unhealthy, a second classification determines whether the lesion appears malignant (potentially cancerous) or benign.',
            accuracy: '~90%'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', width: '100%', backgroundColor: 'transparent' }}>
            {/* Spacer for fixed navbar */}
            <div style={{ height: '80px' }}></div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                padding: '48px 16px'
            }}>
                {/* Main container */}
                <div style={{ width: '100%', maxWidth: '900px' }}>

                    {/* Header */}
                    <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '16px'
                        }}>
                            About <span className="gradient-text">OralScan AI</span>
                        </h1>
                        <p style={{ color: '#b3b3b3', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                            Transparency is important to us. Here's everything about how our AI system works.
                        </p>
                    </div>

                    {/* How It Works Section */}
                    <section className="glass-card animate-fadeInUp" style={{ padding: '32px', marginBottom: '24px' }}>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🔬</span> How Classification Works
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {classificationDetails.map((item, index) => (
                                <div key={index} style={{
                                    background: 'rgba(15, 15, 15, 0.6)',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    border: '1px solid #333'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{
                                                background: item.level === 1 ? 'linear-gradient(135deg, #e50914, #b20710)' : 'linear-gradient(135deg, #f5c518, #c49b00)',
                                                padding: '4px 12px',
                                                borderRadius: '9999px',
                                                color: 'white',
                                                fontSize: '0.875rem',
                                                fontWeight: '600'
                                            }}>
                                                Level {item.level}
                                            </span>
                                            <h3 style={{ color: 'white', fontWeight: '600' }}>{item.title}</h3>
                                        </div>
                                        <span style={{ color: '#46d369', fontSize: '0.875rem', fontWeight: '500' }}>
                                            {item.accuracy} accuracy
                                        </span>
                                    </div>
                                    <p style={{ color: '#b3b3b3', fontSize: '0.875rem', lineHeight: 1.6 }}>
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Model Details */}
                    <section className="glass-card animate-fadeInUp" style={{ padding: '32px', marginBottom: '24px' }}>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🧠</span> AI Model Details
                        </h2>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ background: 'rgba(15, 15, 15, 0.6)', borderRadius: '12px', padding: '20px', border: '1px solid #333' }}>
                                <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>CLIP (Contrastive Language-Image Pre-training)</h3>
                                <p style={{ color: '#b3b3b3', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '12px' }}>
                                    We use OpenAI's CLIP model fine-tuned on oral lesion datasets. CLIP was chosen for its ability to understand both visual features and semantic descriptions of medical conditions.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <span style={{ background: 'rgba(229, 9, 20, 0.2)', color: '#e50914', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem' }}>Vision Transformer</span>
                                    <span style={{ background: 'rgba(229, 9, 20, 0.2)', color: '#e50914', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem' }}>Zero-shot Learning</span>
                                    <span style={{ background: 'rgba(229, 9, 20, 0.2)', color: '#e50914', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem' }}>Multi-modal</span>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(15, 15, 15, 0.6)', borderRadius: '12px', padding: '20px', border: '1px solid #333' }}>
                                <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>Gemini AI (Health Suggestions)</h3>
                                <p style={{ color: '#b3b3b3', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '12px' }}>
                                    After classification, Google's Gemini AI generates personalized health suggestions based on the detected condition. These are educational recommendations, not medical advice.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <span style={{ background: 'rgba(70, 211, 105, 0.2)', color: '#46d369', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem' }}>Natural Language</span>
                                    <span style={{ background: 'rgba(70, 211, 105, 0.2)', color: '#46d369', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem' }}>Context-Aware</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="glass-card animate-fadeInUp" style={{ padding: '32px', marginBottom: '24px' }}>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>⚡</span> Technology Stack
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                            {techStack.map((tech, index) => (
                                <div key={index} style={{
                                    background: 'rgba(15, 15, 15, 0.6)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    textAlign: 'center',
                                    border: '1px solid #333'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{tech.icon}</div>
                                    <h3 style={{ color: 'white', fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>{tech.name}</h3>
                                    <p style={{ color: '#666', fontSize: '0.75rem' }}>{tech.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Privacy & Data */}
                    <section className="glass-card animate-fadeInUp" style={{ padding: '32px', marginBottom: '24px' }}>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🔒</span> Privacy & Data Handling
                        </h2>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(70, 211, 105, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ color: '#46d369' }}>✓</span>
                                </div>
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>No Image Storage</h3>
                                    <p style={{ color: '#b3b3b3', fontSize: '0.875rem' }}>Your images are processed in memory and immediately discarded after analysis. We never store your medical images.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(70, 211, 105, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ color: '#46d369' }}>✓</span>
                                </div>
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>Local Processing</h3>
                                    <p style={{ color: '#b3b3b3', fontSize: '0.875rem' }}>Analysis is performed on-premise. Your data doesn't leave the processing server during classification.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(70, 211, 105, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ color: '#46d369' }}>✓</span>
                                </div>
                                <div>
                                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>Optional Patient Data</h3>
                                    <p style={{ color: '#b3b3b3', fontSize: '0.875rem' }}>Patient information collected is stored only in your browser session and used solely for PDF report generation.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Limitations & Disclaimers */}
                    <section className="glass-card animate-fadeInUp" style={{ padding: '32px', marginBottom: '24px', border: '1px solid rgba(245, 197, 24, 0.3)' }}>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>⚠️</span> Limitations & Disclaimers
                        </h2>

                        <div style={{ color: '#b3b3b3', fontSize: '0.875rem', lineHeight: 1.8 }}>
                            <p style={{ marginBottom: '16px' }}>
                                <strong style={{ color: '#f5c518' }}>This is NOT a medical device.</strong> OralScan AI is designed for educational and research purposes only. It should never be used as a substitute for professional medical diagnosis or treatment.
                            </p>
                            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                                <li style={{ marginBottom: '8px' }}>AI predictions are probabilistic and may be incorrect</li>
                                <li style={{ marginBottom: '8px' }}>Model accuracy varies based on image quality and lighting</li>
                                <li style={{ marginBottom: '8px' }}>Not validated for clinical use by regulatory bodies</li>
                                <li style={{ marginBottom: '8px' }}>Cannot detect all types of oral conditions</li>
                            </ul>
                            <p>
                                <strong style={{ color: 'white' }}>Always consult a qualified healthcare professional</strong> for proper diagnosis and treatment of any oral health concerns.
                            </p>
                        </div>
                    </section>

                    {/* Open Source */}
                    <section className="glass-card animate-fadeInUp" style={{ padding: '32px' }}>
                        <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>💻</span> Open Source
                        </h2>
                        <p style={{ color: '#b3b3b3', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            This project is open source. You can view the complete source code, model architecture, and training methodology on GitHub.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}

export default AboutPage;

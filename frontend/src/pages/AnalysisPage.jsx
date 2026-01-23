import { useState } from 'react';
import axios from 'axios';
import Stepper, { Step } from '../components/Stepper';
import ImageUploader from '../components/ImageUploader';
import ResultCard from '../components/ResultCard';

const API_BASE_URL = 'http://localhost:5000/api';

function AnalysisPage() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [stepperComplete, setStepperComplete] = useState(false);

    // Patient data state
    const [patientData, setPatientData] = useState({
        name: '',
        age: '',
        gender: '',
        symptoms: [],
        duration: '',
        notes: ''
    });

    const handlePatientDataChange = (field, value) => {
        setPatientData(prev => ({ ...prev, [field]: value }));
    };

    const toggleSymptom = (symptom) => {
        setPatientData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }));
    };

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
                // Add patient data to result for report generation
                setResult({ ...response.data, patientData });
            } else {
                setError(response.data.error || 'Analysis failed');
            }
        } catch (err) {
            console.error('Analysis error:', err);
            if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
                setError('Cannot connect to the server. Please try again later.');
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
        setStepperComplete(false);
        setPatientData({
            name: '',
            age: '',
            gender: '',
            symptoms: [],
            duration: '',
            notes: ''
        });
    };

    const handleStepperComplete = () => {
        setStepperComplete(true);
    };

    const symptomOptions = [
        'Pain',
        'Swelling',
        'Bleeding',
        'Discoloration',
        'Ulceration',
        'Burning sensation',
        'Difficulty eating',
        'Bad breath'
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
                padding: '24px 16px'
            }}>
                {/* Header */}
                <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '16px',
                        lineHeight: 1.2
                    }}>
                        Oral Lesion <span className="gradient-text">Analysis</span>
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: '#b3b3b3',
                        maxWidth: '500px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Complete the steps below to receive AI-powered diagnostic analysis
                    </p>
                </div>

                {/* Main Content */}
                {!result ? (
                    !stepperComplete ? (
                        /* Stepper for data collection */
                        <Stepper
                            initialStep={1}
                            onStepChange={(step) => console.log('Step:', step)}
                            onFinalStepCompleted={handleStepperComplete}
                            backButtonText="Previous"
                            nextButtonText="Next"
                        >
                            {/* Step 1: Basic Info */}
                            <Step>
                                <h2 className="stepper-step-title">Patient Information</h2>
                                <p className="stepper-step-description">Enter basic details for the medical report</p>

                                <div className="stepper-row">
                                    <div className="stepper-input-group">
                                        <label className="stepper-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="stepper-input"
                                            placeholder="Enter patient name"
                                            value={patientData.name}
                                            onChange={(e) => handlePatientDataChange('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="stepper-input-group">
                                        <label className="stepper-label">Age</label>
                                        <input
                                            type="number"
                                            className="stepper-input"
                                            placeholder="Enter age"
                                            value={patientData.age}
                                            onChange={(e) => handlePatientDataChange('age', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="stepper-input-group">
                                    <label className="stepper-label">Gender</label>
                                    <select
                                        className="stepper-select"
                                        value={patientData.gender}
                                        onChange={(e) => handlePatientDataChange('gender', e.target.value)}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                </div>
                            </Step>

                            {/* Step 2: Symptoms */}
                            <Step>
                                <h2 className="stepper-step-title">Symptoms</h2>
                                <p className="stepper-step-description">Select any symptoms you are experiencing</p>

                                <div className="stepper-checkbox-group">
                                    {symptomOptions.map((symptom) => (
                                        <label
                                            key={symptom}
                                            className={`stepper-checkbox-item ${patientData.symptoms.includes(symptom) ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={patientData.symptoms.includes(symptom)}
                                                onChange={() => toggleSymptom(symptom)}
                                            />
                                            <span style={{ color: '#b3b3b3', fontSize: '0.875rem' }}>{symptom}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="stepper-input-group" style={{ marginTop: '1.5rem' }}>
                                    <label className="stepper-label">Duration of symptoms</label>
                                    <select
                                        className="stepper-select"
                                        value={patientData.duration}
                                        onChange={(e) => handlePatientDataChange('duration', e.target.value)}
                                    >
                                        <option value="">Select duration</option>
                                        <option value="less-than-week">Less than a week</option>
                                        <option value="1-2-weeks">1-2 weeks</option>
                                        <option value="2-4-weeks">2-4 weeks</option>
                                        <option value="1-3-months">1-3 months</option>
                                        <option value="more-than-3-months">More than 3 months</option>
                                    </select>
                                </div>
                            </Step>

                            {/* Step 3: Additional Notes */}
                            <Step>
                                <h2 className="stepper-step-title">Additional Notes</h2>
                                <p className="stepper-step-description">Any other information that might be helpful</p>

                                <div className="stepper-input-group">
                                    <label className="stepper-label">Medical history or notes (optional)</label>
                                    <textarea
                                        className="stepper-textarea"
                                        placeholder="Enter any relevant medical history, allergies, or additional observations..."
                                        value={patientData.notes}
                                        onChange={(e) => handlePatientDataChange('notes', e.target.value)}
                                    />
                                </div>
                            </Step>

                            {/* Step 4: Upload Image */}
                            <Step>
                                <h2 className="stepper-step-title">Upload Image</h2>
                                <p className="stepper-step-description">Upload a clear photo of the oral lesion for analysis</p>

                                <ImageUploader
                                    onImageSelect={handleImageSelect}
                                    isLoading={isLoading}
                                />
                            </Step>
                        </Stepper>
                    ) : (
                        /* Ready to Analyze */
                        <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }} className="animate-fadeInUp">
                            <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: 'linear-gradient(135deg, #46d369, #2d8f47)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px auto'
                                }}>
                                    <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                                    Ready for Analysis
                                </h2>
                                <p style={{ color: '#b3b3b3', marginBottom: '24px' }}>
                                    All information collected. Click below to start the AI analysis.
                                </p>

                                {/* Summary */}
                                <div style={{
                                    background: 'rgba(15, 15, 15, 0.8)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '24px',
                                    textAlign: 'left'
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.875rem' }}>
                                        <div>
                                            <span style={{ color: '#666' }}>Name:</span>
                                            <span style={{ color: 'white', marginLeft: '8px' }}>{patientData.name || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#666' }}>Age:</span>
                                            <span style={{ color: 'white', marginLeft: '8px' }}>{patientData.age || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#666' }}>Gender:</span>
                                            <span style={{ color: 'white', marginLeft: '8px' }}>{patientData.gender || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#666' }}>Duration:</span>
                                            <span style={{ color: 'white', marginLeft: '8px' }}>{patientData.duration || 'Not provided'}</span>
                                        </div>
                                    </div>
                                    {patientData.symptoms.length > 0 && (
                                        <div style={{ marginTop: '12px', fontSize: '0.875rem' }}>
                                            <span style={{ color: '#666' }}>Symptoms:</span>
                                            <span style={{ color: 'white', marginLeft: '8px' }}>{patientData.symptoms.join(', ')}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="animate-shake glass-card" style={{
                                        padding: '16px',
                                        marginBottom: '24px',
                                        border: '1px solid rgba(255, 71, 87, 0.3)',
                                        background: 'rgba(255, 71, 87, 0.1)',
                                        textAlign: 'left'
                                    }}>
                                        <p style={{ color: '#ff4757', fontSize: '0.875rem' }}>⚠️ {error}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => setStepperComplete(false)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #333',
                                            color: '#b3b3b3',
                                            padding: '12px 24px',
                                            borderRadius: '9999px',
                                            cursor: 'pointer',
                                            fontWeight: 500
                                        }}
                                    >
                                        Edit Info
                                    </button>
                                    <button
                                        onClick={analyzeImage}
                                        disabled={!selectedImage || isLoading}
                                        className="btn-primary"
                                        style={{
                                            padding: '12px 32px',
                                            opacity: !selectedImage || isLoading ? 0.5 : 1,
                                            cursor: !selectedImage || isLoading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid rgba(255,255,255,0.3)',
                                                    borderTopColor: 'white',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite',
                                                    marginRight: '8px'
                                                }}></div>
                                                Analyzing...
                                            </>
                                        ) : (
                                            'Start Analysis'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    /* Results */
                    <div className="animate-fadeInUp" style={{ width: '100%', maxWidth: '896px' }}>
                        <ResultCard result={result} onReset={handleReset} />
                    </div>
                )}

                {/* Disclaimer */}
                {!result && !stepperComplete && (
                    <div className="glass-card animate-fadeInUp" style={{
                        maxWidth: '640px',
                        marginTop: '32px',
                        padding: '16px 24px',
                        border: '1px solid rgba(245, 197, 24, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <svg style={{ width: '20px', height: '20px', color: '#f5c518', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p style={{ color: '#666', fontSize: '0.75rem', lineHeight: 1.5 }}>
                                This tool is for research purposes only. Always consult a healthcare provider for medical advice.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnalysisPage;
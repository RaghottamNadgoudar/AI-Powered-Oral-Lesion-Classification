import { useState, useRef } from 'react';

function ImageUploader({ onImageSelect, isLoading }) {
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
            onImageSelect(file, e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
                {!preview ? (
                    <div
                        onClick={triggerFileInput}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{
                            border: dragOver ? '2px solid #e50914' : '2px dashed rgba(229, 9, 20, 0.5)',
                            borderRadius: '16px',
                            padding: '48px 32px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: dragOver ? 'rgba(229, 9, 20, 0.1)' : 'rgba(15, 15, 15, 0.6)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileInput}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />

                        {/* Upload Icon */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 24px',
                            background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(229, 9, 20, 0.05))',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg
                                style={{ width: '40px', height: '40px', color: '#e50914' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>

                        {/* Upload Text */}
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: 'white',
                            marginBottom: '12px'
                        }}>
                            Drop your image here
                        </h3>
                        <p style={{
                            color: '#b3b3b3',
                            marginBottom: '16px',
                            fontSize: '1rem'
                        }}>
                            or <span style={{ color: '#e50914', fontWeight: '500' }}>browse</span> to choose a file
                        </p>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#666'
                        }}>
                            Supports JPG, PNG, WEBP • Max 10MB
                        </p>
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '24px' }}>
                        {/* Image Preview */}
                        <div style={{
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            marginBottom: '24px'
                        }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                            {!isLoading && (
                                <div
                                    onClick={clearImage}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.5)',
                                        opacity: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'opacity 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                                >
                                    <button style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(4px)'
                                    }}>
                                        Change Image
                                    </button>
                                </div>
                            )}

                            {/* Loading Overlay */}
                            {isLoading && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.7)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div className="spinner" style={{ marginBottom: '16px' }}></div>
                                    <p style={{ color: 'white', fontWeight: '500' }}>Analyzing image...</p>
                                    <p style={{ color: '#b3b3b3', fontSize: '0.875rem', marginTop: '4px' }}>This may take a few seconds</p>
                                </div>
                            )}
                        </div>

                        {/* File Info */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.875rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'rgba(229, 9, 20, 0.2)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <svg
                                        style={{ width: '20px', height: '20px', color: '#e50914' }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p style={{ color: 'white', fontWeight: '500' }}>Image uploaded</p>
                                    <p style={{ color: '#666' }}>Ready for analysis</p>
                                </div>
                            </div>

                            {!isLoading && (
                                <button
                                    onClick={clearImage}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#b3b3b3',
                                        cursor: 'pointer',
                                        padding: '8px'
                                    }}
                                >
                                    <svg
                                        style={{ width: '20px', height: '20px' }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageUploader;

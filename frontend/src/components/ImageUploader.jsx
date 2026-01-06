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
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Create preview
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
        <div className="w-full max-w-2xl mx-auto px-4">
            {!preview ? (
                <div
                    className={`upload-zone rounded-2xl p-16 text-center cursor-pointer ${dragOver ? 'drag-over' : ''
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInput}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* Upload Icon */}
                    <div className="mb-8">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#e50914]/20 to-[#e50914]/5 rounded-full flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-[#e50914]"
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
                    </div>

                    {/* Upload Text */}
                    <h3 className="text-2xl font-semibold text-white mb-3">
                        Drop your image here
                    </h3>
                    <p className="text-[#b3b3b3] mb-5 text-lg">
                        or <span className="text-[#e50914] font-medium">browse</span> to choose a file
                    </p>
                    <p className="text-sm text-[#666]">
                        Supports JPG, PNG, WEBP • Max 10MB
                    </p>
                </div>
            ) : (
                <div className="glass-card p-8 animate-fade-in">
                    {/* Image Preview */}
                    <div className="relative rounded-xl overflow-hidden mb-8 group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                        />
                        {!isLoading && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button
                                    onClick={clearImage}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
                                >
                                    Change Image
                                </button>
                            </div>
                        )}

                        {/* Loading Overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                                <div className="spinner mb-4"></div>
                                <p className="text-white font-medium">Analyzing image...</p>
                                <p className="text-[#b3b3b3] text-sm mt-1">This may take a few seconds</p>
                            </div>
                        )}
                    </div>

                    {/* File Info */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#e50914]/20 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-[#e50914]"
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
                                <p className="text-white font-medium">Image uploaded</p>
                                <p className="text-[#666]">Ready for analysis</p>
                            </div>
                        </div>

                        {!isLoading && (
                            <button
                                onClick={clearImage}
                                className="text-[#b3b3b3] hover:text-[#e50914] transition-colors"
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageUploader;

import React, { useState } from 'react';
import Navbar from './Navbar';
import '../App.css';
import { generateImg2Img, uploadImageToBackend } from '../firebase/FirebaseStorage';

const Img2ImgGenerator = () => {
    const [payload, setPayload] = useState({
        prompt: '',
        strength: 0.7,
        guidance_scale: 7.5,
        steps: 25
    });

    const [inputImage, setInputImage] = useState(null);
    const [inputImageFile, setInputImageFile] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageBlob, setImageBlob] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    // update values when input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayload((prevPayload) => ({
            ...prevPayload,
            [name]: value
        }));
    };

    // validate and process the uploaded file
    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setInputImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setInputImage(imageUrl);
        } else {
            alert("Please select a valid image file");
        }
    };

    // file input handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    // drag & drop handlers
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            processFile(files[0]);
        }
    };


    // form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!inputImageFile || !payload.prompt) {
            alert("Please select an image and enter a prompt");
            return;
        }
        
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("image", inputImageFile);
            formData.append("prompt", payload.prompt);
            formData.append("strength", payload.strength);
            formData.append("guidance_scale", payload.guidance_scale);
            formData.append("steps", payload.steps);

            const response = await generateImg2Img(formData);

            if (response.status === 200 && response.data.data) {
                const byteString = atob(response.data.data);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: 'image/png' });
                
                const imageUrl = URL.createObjectURL(blob);
                setGeneratedImage(imageUrl);
                setImageBlob(blob);
            }
        } catch (error) {
            console.error("Error generating image:", error);
            let errorMessage = "Error generating image. ";
            
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                errorMessage += `Server responded with status ${error.response.status}`;
            } else if (error.request) {
                console.error("No response received:", error.request);
                errorMessage += "No response from server. Check if the backend is running.";
            } else {
                console.error("Error message:", error.message);
                errorMessage += error.message;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async () => {
        if (!imageBlob) return;
        setUploading(true);

        try {
            await uploadImageToBackend(imageBlob, payload.prompt);
            alert("Image posted successfully!");
        } catch (error) {
            alert("Failed to post image.");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = () => {
        if (!imageBlob) return;
        const link= document.createElement('a');
        link.href = URL.createObjectURL(imageBlob);
        link.download = `generated_image.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div>
            <Navbar />
            <h1>Image to Image Generator</h1>
            <div className="container">                
                <form onSubmit={handleSubmit}>

                    {/* drag & drop section */}
                    <div className="image-upload-container">
                        <label htmlFor="image-upload" className="form-label">Upload Image</label>
                        
                        <div 
                            className={`drag-drop-zone ${isDragOver ? 'drag-over' : ''} ${inputImage ? 'has-image' : ''}`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('image-upload').click()}
                        >
                            {inputImage ? (
                                <div className="preview-container">
                                    <img src={inputImage} alt="Preview" className="image-preview" />
                                    <div className="image-overlay">
                                        <p>Click or drag to change image</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="drop-zone-content">
                                    <div className="upload-icon">📁</div>
                                    <p className="drop-text">
                                        {isDragOver ? 'Drop your image here' : 'Drag & drop an image here'}
                                    </p>
                                    <p className="or-text">or</p>
                                    <span className="browse-text">Click to browse</span>
                                </div>
                            )}
                        </div>
                        
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="file-input-hidden"
                        />
                    </div>

                    {/* prompt input */}
                    <div className="prompt-container">
                        <label htmlFor="prompt" className="form-label">Transformation Prompt</label>
                        <textarea
                            id="prompt"
                            name="prompt"
                            value={payload.prompt}
                            onChange={handleChange}
                            rows={4}
                            cols={50}
                            placeholder="Describe how you want to transform the image"
                        />
                    </div>

                    {/*strength */}
                    <div className="slider-container">
                        <label htmlFor="strength" className="form-label">
                            Transformation Strength: {payload.strength}
                        </label>
                        <input
                            type="range"
                            id="strength"
                            name="strength"
                            min="0.1"
                            max="0.9"
                            step="0.1"
                            value={payload.strength}
                            onChange={handleChange}
                            className="slider"
                        />
                        <div className="slider-labels">
                            <span>Subtle</span>
                            <span>Strong</span>
                        </div>
                    </div>

                    {/* prompt guidance */}
                    <div className="slider-container">
                        <label htmlFor="guidance_scale" className="form-label">
                            Prompt Guidance: {payload.guidance_scale}
                        </label>
                        <input
                            type="range"
                            id="guidance_scale"
                            name="guidance_scale"
                            min="1"
                            max="15"
                            step="0.5"
                            value={payload.guidance_scale}
                            onChange={handleChange}
                            className="slider"
                        />
                        <div className="slider-labels">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>

                    {/* quality/steps */}
                    <div className="slider-container">
                        <label htmlFor="steps" className="form-label">
                            Quality (Steps): {payload.steps}
                        </label>
                        <input
                            type="range"
                            id="steps"
                            name="steps"
                            min="10"
                            max="50"
                            step="5"
                            value={payload.steps}
                            onChange={handleChange}
                            className="slider"
                        />
                        <div className="slider-labels">
                            <span>Fast</span>
                            <span>High Quality</span>
                        </div>
                    </div>

                    {/* submit button */}
                    <button
                        type="submit"
                        className="generate-button"
                        disabled={loading || !inputImageFile}
                    >
                        {loading ? 'Transforming...' : 'Transform Image'}
                    </button>
                </form>

                {/* generated image */}
                <div className="generated-image">
                    <div className="image-container">
                        <div className="image">
                            {generatedImage ? (
                                <img src={generatedImage} alt="Transformed image" />
                            ) : (
                                <div className="placeholder">Generated image will appear here</div>
                            )}
                        </div>
                    </div>
                    {(generatedImage && !uploading) && (
                        <div className='button-group'>
                            <button 
                                onClick={handlePost} 
                                className="post-button" 
                                disabled={uploading}
                            >
                                {uploading ? "Posting..." : "Post"}
                            </button>

                            <button
                                onClick={handleDownload} 
                                className="download-button"
                                disabled={!generatedImage}
                            > Download 
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Img2ImgGenerator;
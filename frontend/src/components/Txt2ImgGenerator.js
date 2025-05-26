import React, {useState} from 'react';
import Navbar from './Navbar';
import '../App.css';
import axios from 'axios';
import { uploadImageToFirebase } from '../firebase/FirebaseStorage';

const Text2ImgGenerator = () => {

    const [payload, setPayload] = useState({ 
        prompt: '',
        aspectRatio: '1:1',
        seed: '5',
        style: 'photographic',
        format: 'png',
        negativePrompt: 'blurry, low quality, bad anatomy, worst quality',
    });

    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageBlob, setImageBlob] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Make sure this points to your Flask backend server
    const API_URL = 'http://localhost:5000';

    // Input change handler
    const handleChange = (e) => {
        const {name, value} = e.target;
        setPayload((prevPayload) => ({
            ...prevPayload,
            [name]: value
        }));
    };

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!payload.prompt) {
            alert("Please provide a prompt.");
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/text2img`, {
                prompt: payload.prompt,
                aspect_ratio: payload.aspectRatio,
                seed: parseInt(payload.seed),
                style: payload.style,
                format: payload.format,
                negative_prompt: payload.negativePrompt
            });

            if (response.status === 200 && response.data.data) {
                // Convert base64 to blob
                const byteString = atob(response.data.data);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: `image/${payload.format}` });
                
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
            await uploadImageToFirebase(imageBlob, payload.prompt);
            alert("Image posted successfully!");
        } catch (error) {
            alert("Failed to post image.");
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div>
            <Navbar />
            <h1>Text to Image Generator</h1>
            <div className="container">
                
                
                <form onSubmit={handleSubmit}>
                    {/*prompt*/}
                    <div className='prompt-container'>
                        <label htmlFor="prompt" className="form-label">Prompt</label>
                        <textarea 
                            id="prompt" 
                            name='prompt' 
                            value={payload.prompt} 
                            onChange={handleChange} 
                            rows={4} 
                            cols={50} 
                            placeholder="Enter your prompt here" 
                        />
                    </div>

                    {/*aspect ratio*/}
                    <div className="form-group">
                        <label htmlFor="aspectRatio" className="form-label">Aspect Ratio</label>
                        <select 
                            name="aspectRatio" 
                            value={payload.aspectRatio} 
                            onChange={handleChange} 
                            id="aspectRatio" 
                            className='selectstyle'
                        >
                            <option value="1:1">Square (1:1)</option>
                            <option value="16:9">Landscape (16:9)</option>
                            <option value="9:16">Portrait (9:16)</option>
                        </select>
                    </div>

                    {/*image style*/}
                    <div className="form-group">
                        <label htmlFor="style" className="form-label">Style</label>
                        <select 
                            name="style" 
                            value={payload.style} 
                            onChange={handleChange} 
                            id="style" 
                            className='selectstyle'
                        >
                            <option value="photographic">Photographic</option>
                            <option value="digital-art">Digital Art</option>
                            <option value="anime">Anime</option>
                            <option value="cinematic">Cinematic</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="3d-model">3D Model</option>
                            <option value="cartoon">Cartoon</option>
                        </select>
                    </div>

                    {/*negative prompt*/}
                    <div className='form-group'>
                        <label htmlFor="negativePrompt" className="form-label">Negative Prompt</label>
                        <textarea 
                            id="negativePrompt" 
                            name='negativePrompt' 
                            value={payload.negativePrompt} 
                            onChange={handleChange} 
                            rows={2} 
                            cols={50} 
                            placeholder="Elements to exclude from generation" 
                        />
                    </div>

                    {/*seed
                    <div className="form-group">
                        <label htmlFor="seed" className="form-label">Seed (for reproducibility)</label>
                        <input 
                            type="number" 
                            id="seed" 
                            name="seed" 
                            value={payload.seed} 
                            onChange={handleChange} 
                            min="0" 
                            max="2147483647" 
                        />
                    </div>
*/}
                    {/*image format*/}
                    <div className="form-group">
                        <label htmlFor="format" className="form-label">Image Format</label>
                        <select 
                            name="format" 
                            value={payload.format} 
                            onChange={handleChange} 
                            id="format" 
                            className='selectstyle'
                        >
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="webp">WEBP</option>
                        </select>
                    </div>
                    
                    {/*submit button*/}
                    <button 
                        type="submit" 
                        className="generate-button" 
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate Image'}
                    </button>
                </form> 

                {/*generated image*/}
                <div className="generated-image">
                    <div className="image-container">
                        <div className="image">
                            {generatedImage ? (
                                <img src={generatedImage} alt="Generated image" />
                            ) : (
                                <div className="placeholder">Generated image will appear here</div>
                            )}
                        </div>  
                    </div>
                    {(generatedImage && !uploading) && 
                        <button 
                            onClick={handlePost} 
                            className="post-button" 
                            disabled={uploading}
                        >
                            {uploading ? "Posting..." : "Post"}
                        </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default Text2ImgGenerator;
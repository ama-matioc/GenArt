import React, {useState} from 'react';
import Navbar from './Navbar';
import '../App.css';
import axios from 'axios';
import { uploadImageToFirebase } from '../firebase/FirebaseStorage';

const ImageGenerator = () => {

    const [payload, setPayload] = useState({ 
        prompt: '',
        aspectRatio: '1:1',
        seed: '5',
        style: 'photographic',
        format: 'png'
    });

    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageBlob, setImageBlob] = useState(null);
    const [uploading, setUploading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;
    const API_KEY = process.env.REACT_APP_API_KEY;

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
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("prompt", payload.prompt);
            formData.append("output_format", payload.format);

            const response = await axios.post(API_URL, formData, {
                responseType: "arraybuffer",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    Accept: "image/*",
                },
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: "image/png" });
                const imageUrl = URL.createObjectURL(blob);
                setGeneratedImage(imageUrl);
                setImageBlob(blob);
            }
        } catch (error) {
            console.error("Error generating image:", error);
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
            <div className="container"> 
                {/*options*/}
                <form action="" onSubmit={handleSubmit}>
                    <div className='prompt-container'>
                        <label htmlFor="prompt" className="form-label">Prompt</label>
                        <textarea id="prompt" name='prompt' value={payload.prompt} onChange={handleChange} rows={4} cols={50} placeholder="Enter your prompt here" />
                    </div>

                    {/*image style*/}
                    <div className="imagestyle">
                        <label htmlFor="style" className="form-label">Image Style</label>
                        <select name="style" value={payload.style} onChange={handleChange} id="style" className='selectstyle'>
                            <option value="photographic">Photographic</option>
                            <option value="anime">Anime</option>
                            <option value="cinematic">Cinematic</option> 
                            <option value="neon-punk">Neon-punk</option>
                            <option value="3d-model">3D Model</option>
                        </select>
                    </div>

                    {/*image format*/}
                    <div className="imagestyle">
                        <label htmlFor="format" className="form-label">Image Format</label>
                        <select name="format" value={payload.format} onChange={handleChange} id="format" className='selectstyle'>
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="webp">WEBP</option>
                        </select>
                    </div>
                    
                    {/*submit button*/}
                    <button type="submit" className="generate-button" disabled={loading}>{loading ? 'Generating...' : 'Generate Image'}</button>
                </form> 

                {/*generated image*/}
                <div className="generated-image">
                <div className="image-container">
                    <div className="image">
                        <img src={generatedImage} alt="Generated image will appear here" />                
                    </div>  
                </div>
                {( generatedImage && !uploading) && 
                <button onClick={handlePost} className="post-button" disabled={uploading}>
                    {uploading ? "Posting..." : "Post"}
                </button> 
}
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
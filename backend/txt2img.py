import base64
import os
from dotenv import load_dotenv
import io
from PIL import Image
from huggingface_hub import InferenceClient

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")
HF_MODEL = "stabilityai/stable-diffusion-3.5-large-turbo"

def generate_text2image(prompt, aspect_ratio="1:1", seed=0, style="photographic", output_format="png", negative_prompt=""):

    #map aspect ratios to pixel dimensions
    size_map = {
        "1:1": (1024, 1024),
        "16:9": (1792, 1024),
        "9:16": (1024, 1792)
    }
    
    width, height = size_map.get(aspect_ratio, (1024, 1024))
    
    # add style to prompt if specified
    styled_prompt = prompt
    if style != "photographic":
        styled_prompt = f"{prompt}, {style} style"
    
    try:
        # initialize the Hugging Face client
        client = InferenceClient(
            provider="hf-inference",
            api_key=HF_API_KEY,
        )
        
        # generate the image
        image = client.text_to_image(
            prompt=styled_prompt,
            negative_prompt=negative_prompt if negative_prompt else None,
            model=HF_MODEL,
            width=width,
            height=height,
            seed=seed if seed != 0 else None
        )
        
        output_buffer = io.BytesIO()
        image.save(output_buffer, format=output_format.upper())
        output_buffer.seek(0)
        
        # encode to base64
        b64_image = base64.b64encode(output_buffer.getvalue()).decode('utf-8')
        
        return b64_image
        
    except Exception as e:
        print(f"Error generating image: {e}")
        raise Exception(f"Failed to generate image: {str(e)}")

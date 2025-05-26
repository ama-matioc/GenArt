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
    """
    Generate an image from text prompt using Hugging Face's Stable Diffusion 3.5.
    
    Args:
        prompt (str): The text prompt to generate an image from
        aspect_ratio (str): Aspect ratio in format "width:height"
        seed (int): Seed for reproducibility
        style (str): The style of the generated image
        output_format (str): The output format (png, jpeg, webp)
        
    Returns:
        str: Base64 encoded image data
    """
    
    # Map aspect ratios to pixel dimensions
    size_map = {
        "1:1": (1024, 1024),
        "16:9": (1792, 1024),
        "9:16": (1024, 1792)
    }
    
    # Get the size from the map, default to 1024x1024
    width, height = size_map.get(aspect_ratio, (1024, 1024))
    
    # Add style to prompt if specified
    styled_prompt = prompt
    if style != "photographic":
        styled_prompt = f"{prompt}, {style} style"
    
    try:
        # Initialize the Hugging Face client
        client = InferenceClient(
            provider="hf-inference",
            api_key=HF_API_KEY,
        )
        
        # Generate the image
        image = client.text_to_image(
            prompt=styled_prompt,
            negative_prompt=negative_prompt if negative_prompt else None,
            model=HF_MODEL,
            width=width,
            height=height,
            seed=seed if seed != 0 else None
        )
        
        # Convert to desired format
        output_buffer = io.BytesIO()
        image.save(output_buffer, format=output_format.upper())
        output_buffer.seek(0)
        
        # Encode to base64
        b64_image = base64.b64encode(output_buffer.getvalue()).decode('utf-8')
        
        return b64_image
        
    except Exception as e:
        print(f"Error generating image: {e}")
        raise Exception(f"Failed to generate image: {str(e)}")

# Example usage (for testing)
if __name__ == "__main__":
    # Test the function
    test_prompt = "A beautiful sunset over a mountain lake"
    try:
        result = generate_text2image(test_prompt)
        print(f"Successfully generated image, base64 length: {len(result)}")
    except Exception as e:
        print(f"Test failed: {e}")
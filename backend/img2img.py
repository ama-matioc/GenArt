from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image
import torch
from diffusers.utils import load_image
from io import BytesIO
import base64

pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",  
    torch_dtype=torch.float32
).to("cpu")

def generate_image2image(
    input_image_bytes: bytes,
    prompt: str,
    strength: float = 0.7,
    guidance_scale: float = 7.5,
    num_steps: int = 25,
    ) -> str:
    
    """
    Returns a base64-encoded PNG.
    """
    # Load and preprocess
    img = Image.open(BytesIO(input_image_bytes)).convert("RGB").resize((512, 512))

    # Run pipeline
    out_img = pipe(
        prompt=prompt,
        image=img,
        strength=strength,
        guidance_scale=guidance_scale,
        num_inference_steps=num_steps
    ).images[0]

    # Encode to base64 for transport
    buffered = BytesIO()
    out_img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

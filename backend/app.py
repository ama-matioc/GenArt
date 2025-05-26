from flask import Flask, jsonify, request
from flask_cors import CORS
from img2img import generate_image2image
from txt2img import generate_text2image

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/img2img', methods=['POST'])
def img2img():
    file = request.files.get("image")
    prompt = request.form.get("prompt", "")
    strength = float(request.form.get("strength", 0.7))
    guidance = float(request.form.get("guidance_scale", 7.5))
    steps = int(request.form.get("steps", 25))

    if not file or not prompt:
        return jsonify({"error": "Image file and prompt are required"}), 400

    img_bytes = file.read()
    b64 = generate_image2image(
        input_image_bytes=img_bytes,
        prompt=prompt,
        strength=strength,
        guidance_scale=guidance,
        num_steps=steps
    )
    return jsonify({"data": b64})

@app.route('/api/text2img', methods=['POST'])
def text2img():
    data = request.json
    
    if not data or not data.get('prompt'):
        return jsonify({"error": "Prompt is required"}), 400
    
    prompt = data.get('prompt')
    aspect_ratio = data.get('aspect_ratio', '1:1')
    seed = data.get('seed', 0)
    style = data.get('style', 'photographic')
    img_format = data.get('format', 'png')
    negative_prompt = data.get('negative_prompt', '')
    
    try:
        b64 = generate_text2image(
            prompt=prompt,
            aspect_ratio=aspect_ratio,
            seed=seed,
            style=style,
            output_format=img_format,
            negative_prompt=negative_prompt
        )
        return jsonify({"data": b64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
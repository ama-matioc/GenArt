import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from img2img import generate_image2image
from txt2img import generate_text2image
import firebase_admin
from firebase_admin import credentials, auth as admin_auth, storage as admin_storage, firestore as admin_fs
import time
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
  "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET")
})

bucket = admin_storage.bucket()
db = admin_fs.client()

# helper function to get username from Firestore
def get_username_from_firestore(uid):
    try:
        user_doc = db.collection("users").document(uid).get()
        if user_doc.exists:
            return user_doc.to_dict().get("username", "Anonymous")
        else:
            return "Anonymous"
    except Exception as e:
        print(f"Error fetching username from Firestore: {e}")
        return "Anonymous"

# upload image to Firestore route
@app.route("/api/upload-image", methods=["POST"])
def upload_image():
    id_token = request.headers.get("Authorization", "").split("Bearer ")[-1]
    decoded = admin_auth.verify_id_token(id_token)
    uid = decoded["uid"]
    
    username = get_username_from_firestore(uid)

    file = request.files.get("image")
    prompt = request.form.get("prompt")
    if not file or not prompt:
        return jsonify({"error":"Missing image or prompt"}), 400

    blob = bucket.blob(f"generated_images/{uid}/{int(time.time())}.png")
    blob.upload_from_string(file.read(), content_type=file.content_type)
    blob.make_public()  
    image_url = blob.public_url

    db.collection("images").add({
      "userId": uid,
      "username": username,
      "imageUrl": image_url,
      "prompt": prompt,
      "timestamp": admin_fs.SERVER_TIMESTAMP
    })

    return jsonify({"imageUrl": image_url})

# get public image gallery route
@app.route("/api/images", methods=["GET"])
def list_images():
    docs = db.collection("images").order_by("timestamp", direction=admin_fs.Query.DESCENDING).stream()
    return jsonify([ {**doc.to_dict(), "id": doc.id} for doc in docs ])

# get user's images route
@app.route("/api/images/user", methods=["GET"])
def list_user_images():
    id_token = request.headers.get("Authorization","").split("Bearer ")[-1]
    uid = admin_auth.verify_id_token(id_token)["uid"]
    docs = db.collection("images")\
             .where("userId","==",uid)\
             .order_by("timestamp", direction=admin_fs.Query.DESCENDING)\
             .stream()
    return jsonify([ {**doc.to_dict(), "id": doc.id} for doc in docs ])

# get user profile route
@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    id_token = request.headers.get("Authorization", "").split("Bearer ")[-1]
    uid = admin_auth.verify_id_token(id_token)["uid"]
    
    user_doc = db.collection("users").document(uid).get()
    if user_doc.exists:
        user_data = user_doc.to_dict()

        created_at = user_data.get("created_at")
        join_date = created_at.isoformat() if hasattr(created_at, 'isoformat') else str(created_at)
        return jsonify({
            "username": user_data.get("username", "Anonymous"),
            "join_date": join_date
        })
    else:
        return jsonify({"error": "User not found"}), 404
    
# image-to-image transformation route
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

# text-to-image generation route
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
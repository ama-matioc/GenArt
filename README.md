# GenArt

GenArt is a full-stack web application that leverages advanced AI models to create and transform images based on text descriptions. The application allows users to generate images from scratch, modify existing images, and share their creations with the community.

## Features

- **Text-to-Image Generation**: Create images from text prompts with customizable parameters
- **Image-to-Image Transformation**: Modify uploaded images based on text descriptions
- **User Authentication**: Secure account creation and login via Firebase
- **Personal Gallery**: Save and manage your generated images
- **Community Gallery**: Browse and search images created by other users
- **Image Download**: Save your creations to your device

## Technology Stack

### Frontend

- React.js: Component-based UI development
- Firebase SDK: Authentication and data services
- Axios: API communication
- React Router: Navigation and routing

### Backend

- Flask: Python web framework for RESTful API
- Hugging Face Inference API: Remote text-to-image generation
- Diffusers: Local image-to-image transformation
- Firebase Admin SDK: Server-side authentication and storage

### External Services

- Firebase Authentication: User management
- Firebase Firestore: Database for image metadata and user information
- Firebase Storage: Cloud storage for generated images

## Installation

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Firebase account
- Hugging Face account and API key

### Backend Setup

1. Clone the repository

   ```
   git clone https://github.com/ama-matioc/GenArt.git
   cd GenArt/backend
   ```

2. Create a virtual environment

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies

   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your configuration

   ```
   HF_API_KEY=your_huggingface_api_key
   FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   ```

5. Add your Firebase service account key

   - Download `serviceAccountKey.json` from Firebase Console
   - Place it in the backend directory

6. Run the server
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory

   ```
   cd ../frontend
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Create a `.env` file with your Firebase configuration

   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server
   ```
   npm start
   ```

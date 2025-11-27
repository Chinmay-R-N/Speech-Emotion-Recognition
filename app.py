from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import librosa
import numpy as np
import joblib
import os
import tempfile
import soundfile as sf
import warnings
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Suppress librosa warnings
warnings.filterwarnings('ignore', category=UserWarning)
warnings.filterwarnings('ignore', category=FutureWarning)

app = FastAPI()

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
MODEL_PATH = "emotion_model.joblib"
model = joblib.load(MODEL_PATH)
logger.info("Model loaded successfully")

# Emotion label map with confidence thresholds
LABELS = {
    0: {"name": "Neutral", "threshold": 0.3},
    1: {"name": "Fearful", "threshold": 0.3},
    2: {"name": "Happy", "threshold": 0.3},
    3: {"name": "Sad", "threshold": 0.3},
    4: {"name": "Angry", "threshold": 0.3}
}

def extract_features(file_path, n_mfcc=13):
    """Extract comprehensive audio features from an audio file."""
    try:
        # Try loading with soundfile first
        logger.debug(f"Attempting to load audio file: {file_path}")
        y, sr = sf.read(file_path)
        if len(y.shape) > 1:
            y = y.mean(axis=1)  # Convert stereo to mono if needed
        logger.debug(f"Audio loaded successfully with soundfile. Shape: {y.shape}, Sample rate: {sr}")
    except Exception as e:
        logger.warning(f"Soundfile failed, falling back to librosa: {str(e)}")
        # Fallback to librosa if soundfile fails
        y, sr = librosa.load(file_path, sr=None, mono=True)
        logger.debug(f"Audio loaded successfully with librosa. Shape: {y.shape}, Sample rate: {sr}")
    
    # Extract MFCCs
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    mfcc_mean = np.mean(mfcc.T, axis=0)
    mfcc_std = np.std(mfcc.T, axis=0)
    
    # Extract spectral features
    spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
    spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)[0]
    
    # Extract zero crossing rate
    zero_crossing_rate = librosa.feature.zero_crossing_rate(y)[0]
    
    # Extract chroma features
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    
    # Combine all features
    features = np.concatenate([
        mfcc_mean,
        mfcc_std,
        [np.mean(spectral_centroids), np.std(spectral_centroids)],
        [np.mean(spectral_rolloff), np.std(spectral_rolloff)],
        [np.mean(spectral_contrast), np.std(spectral_contrast)],
        [np.mean(zero_crossing_rate), np.std(zero_crossing_rate)],
        np.mean(chroma, axis=1),
        np.std(chroma, axis=1)
    ])
    
    logger.debug(f"Features extracted successfully. Shape: {features.shape}")
    return features

@app.post("/predict")
async def predict_emotion(file: UploadFile = File(...)):
    try:
        logger.info(f"Received audio file: {file.filename}")
        
        # Save uploaded file to a temp location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await file.read()
            logger.debug(f"Read {len(content)} bytes from uploaded file")
            temp_file.write(content)
            temp_path = temp_file.name
            logger.debug(f"Saved temporary file to: {temp_path}")

        # Extract features and predict
        features = extract_features(temp_path).reshape(1, -1)
        logger.debug(f"Features shape after reshape: {features.shape}")
        
        # Get prediction probabilities
        probabilities = model.predict_proba(features)[0]
        logger.debug(f"Prediction probabilities: {probabilities}")
        
        # Get the predicted class and its confidence
        predicted_class = np.argmax(probabilities)
        confidence = probabilities[predicted_class]
        logger.info(f"Predicted class: {predicted_class}, Confidence: {confidence}")
        
        # Get the emotion name and check if it meets the confidence threshold
        emotion_info = LABELS.get(predicted_class, {"name": "Unknown", "threshold": 0.0})
        emotion = emotion_info["name"]
        
        # Clean up
        os.remove(temp_path)
        logger.debug("Temporary file removed")

        response = {
            "emotion": emotion,
            "confidence": float(confidence),
            "is_confident": bool(confidence >= emotion_info["threshold"]),
            "probabilities": {
                LABELS[i]["name"]: float(prob) 
                for i, prob in enumerate(probabilities)
            }
        }
        logger.info(f"Sending response: {response}")
        return response
        
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}", exc_info=True)
        return {"error": "Failed to process audio file. Please ensure it's a valid audio file."}

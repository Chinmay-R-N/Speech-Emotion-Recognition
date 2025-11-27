import os
import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

# Set the path to your dataset
DATASET_PATH = "E:/SER(chatgpt)/ASED_V1-main"
LABEL_MAP = {
    '01Neutral': 0,
    '02Fearful': 1,
    '03Happy': 2,
    '04Sad': 3,
    '05Angry': 4
}

def extract_features(file_path, n_mfcc=13):
    """Extract comprehensive audio features from an audio file."""
    y, sr = librosa.load(file_path, sr=None)
    
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
    
    return features

def load_dataset():
    X, y = [], []
    for emotion_folder, label in LABEL_MAP.items():
        folder_path = os.path.join(DATASET_PATH, emotion_folder)
        for file in os.listdir(folder_path):
            if file.lower().endswith('.wav'):
                try:
                    file_path = os.path.join(folder_path, file)
                    features = extract_features(file_path)
                    X.append(features)
                    y.append(label)
                except Exception as e:
                    print(f"[ERROR] {file_path}: {e}")
    return np.array(X), np.array(y)

def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred, target_names=LABEL_MAP.keys())
    print("\nClassification Report:\n", report)
    
    return model

def save_model(model, output_path="emotion_model.joblib"):
    joblib.dump(model, output_path)
    print(f"Model saved to {output_path}")

if __name__ == "__main__":
    print("Loading dataset...")
    X, y = load_dataset()
    print(f"Dataset loaded: {X.shape[0]} samples")

    print("Training model...")
    model = train_model(X, y)

    save_model(model)

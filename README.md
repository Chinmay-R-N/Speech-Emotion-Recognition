# 🎤 Speech Emotion Recognition System

A full-stack web application that uses machine learning to recognize emotions from speech audio files. The system can detect five different emotions: **Neutral**, **Fearful**, **Happy**, **Sad**, and **Angry** with confidence scores and probability distributions.

![Speech Emotion Recognition](https://img.shields.io/badge/Speech-Emotion%20Recognition-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-teal)

## ✨ Features

- 🎯 **High Accuracy**: Trained on ASED_V1 dataset using Random Forest Classifier
- 🎨 **Modern UI**: Beautiful, responsive React frontend with Tailwind CSS
- 📤 **Audio Upload**: Upload audio files (WAV format) for emotion analysis
- 🎙️ **Live Recording**: Record audio directly in the browser for real-time analysis
- 📊 **Detailed Results**: View emotion predictions with confidence scores and probability distributions
- 🔄 **Real-time Processing**: Fast API response with comprehensive audio feature extraction
- 🎭 **5 Emotion Classes**: Detects Neutral, Fearful, Happy, Sad, and Angry emotions

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework for building APIs
- **Librosa** - Audio analysis and feature extraction
- **Scikit-learn** - Machine learning (Random Forest Classifier)
- **Joblib** - Model serialization
- **Soundfile** - Audio file I/O

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📁 Project Structure

```
Speech Emotion Recognition/
├── app.py                      # FastAPI backend server
├── train_emotion_model.py      # Model training script
├── emotion_model.joblib        # Trained ML model
├── index.html                  # HTML entry point
├── package.json                # Frontend dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── ASED_V1-main/               # Dataset directory
│   ├── 01Neutral/              # Neutral emotion samples
│   ├── 02Fearful/              # Fearful emotion samples
│   ├── 03Happy/                # Happy emotion samples
│   ├── 04Sad/                  # Sad emotion samples
│   └── 05Angry/                # Angry emotion samples
└── src/                        # Frontend source code
    ├── App.tsx                 # Main React component
    ├── components/             # React components
    │   ├── AudioUploader.tsx
    │   ├── LiveRecorder.tsx
    │   └── EmotionResult.tsx
    ├── api/                    # API integration
    │   └── emotionAPI.ts
    ├── types/                  # TypeScript type definitions
    │   └── emotion.ts
    └── utils/                  # Utility functions
```

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd "Speech Emotion Recognition"
```

2. Install Python dependencies:
```bash
pip install fastapi uvicorn librosa numpy scikit-learn joblib soundfile python-multipart
```

Or create a `requirements.txt` file:
```txt
fastapi==0.104.1
uvicorn==0.24.0
librosa==0.10.1
numpy==1.24.3
scikit-learn==1.3.2
joblib==1.3.2
soundfile==0.12.1
python-multipart==0.0.6
```

Then install:
```bash
pip install -r requirements.txt
```

3. Train the model (optional - if you want to retrain):
```bash
python train_emotion_model.py
```

**Note**: Update the `DATASET_PATH` in `train_emotion_model.py` to point to your dataset location.

### Frontend Setup

1. Navigate to the project root directory

2. Install dependencies:
```bash
npm install
```

3. Update API URL (if needed):
   - Edit `src/api/emotionAPI.ts` and change `API_URL` if your backend runs on a different port or host.

## 🎮 Usage

### Starting the Backend Server

1. Make sure `emotion_model.joblib` exists in the project root (or train it first)

2. Start the FastAPI server:
```bash
uvicorn app:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Starting the Frontend

1. In a new terminal, start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Using the Application

1. **Upload Audio File**:
   - Click on the "Audio Upload" tab
   - Select or drag & drop a WAV audio file
   - Wait for the analysis to complete
   - View the emotion prediction with confidence scores

2. **Live Recording**:
   - Click on the "Live Recording" tab
   - Click the record button and speak
   - Stop recording when done
   - View the emotion analysis results

## 📡 API Documentation

### Endpoint: `/predict`

**Method**: `POST`

**Description**: Analyzes an audio file and returns emotion prediction

**Request**:
- Content-Type: `multipart/form-data`
- Body: Audio file (WAV format)

**Response**:
```json
{
  "emotion": "Happy",
  "confidence": 0.85,
  "is_confident": true,
  "probabilities": {
    "Neutral": 0.05,
    "Fearful": 0.03,
    "Happy": 0.85,
    "Sad": 0.04,
    "Angry": 0.03
  }
}
```

**Response Fields**:
- `emotion`: Predicted emotion label
- `confidence`: Confidence score (0-1) for the prediction
- `is_confident`: Boolean indicating if confidence meets threshold (≥0.3)
- `probabilities`: Probability distribution across all emotion classes

## 🧠 Model Details

### Feature Extraction

The model extracts comprehensive audio features including:
- **MFCCs** (Mel-frequency Cepstral Coefficients): 13 coefficients with mean and std
- **Spectral Features**: Centroid, rolloff, and contrast
- **Zero Crossing Rate**: Measures signal frequency
- **Chroma Features**: Pitch class profiles

### Model Architecture

- **Algorithm**: Random Forest Classifier
- **Estimators**: 100 trees
- **Training**: 80/20 train-test split
- **Dataset**: ASED_V1 dataset with 5 emotion classes

### Supported Emotions

1. **Neutral** (Label: 0)
2. **Fearful** (Label: 1)
3. **Happy** (Label: 2)
4. **Sad** (Label: 3)
5. **Angry** (Label: 4)

## 📊 Dataset

The model is trained on the **ASED_V1** dataset, which contains:
- 522 Neutral samples
- 510 Fearful samples
- 486 Happy samples
- 470 Sad samples
- 486 Angry samples

**Total**: ~2,474 audio samples

## 🔧 Configuration

### Backend Configuration

- **Model Path**: `emotion_model.joblib` (default)
- **CORS**: Currently allows all origins (update for production)
- **Confidence Threshold**: 0.3 for all emotions

### Frontend Configuration

- **API URL**: `http://localhost:8000` (default)
- Update in `src/api/emotionAPI.ts` for production deployment

## 🚢 Deployment

### Backend Deployment

1. Use a production ASGI server:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

2. For production, consider:
   - Using environment variables for configuration
   - Restricting CORS to specific origins
   - Adding authentication/rate limiting
   - Using a reverse proxy (nginx)

### Frontend Deployment

1. Build for production:
```bash
npm run build
```

2. The `dist/` folder contains the production-ready files

3. Deploy to:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting service

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- ASED_V1 dataset for providing the training data
- Librosa community for excellent audio processing tools
- FastAPI and React communities for amazing frameworks

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Made with ❤️ using Python, React, and Machine Learning**


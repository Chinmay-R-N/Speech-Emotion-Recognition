# 🚀 How to Run the Speech Emotion Recognition Project

This guide will walk you through setting up and running the project step by step.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16 or higher** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

Verify installations:
```bash
python --version
node --version
npm --version
```

## 🔧 Step 1: Install Backend Dependencies

1. Open a terminal/command prompt in the project root directory.

2. Create a virtual environment (recommended):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install Python packages:
```bash
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist, install manually:
```bash
pip install fastapi uvicorn librosa numpy scikit-learn joblib soundfile python-multipart
```

## 🎨 Step 2: Install Frontend Dependencies

1. In the same project root directory, install npm packages:
```bash
npm install
```

This will install all React, TypeScript, and other frontend dependencies.

## 🤖 Step 3: Verify Model File

Make sure the trained model file exists:
- Check that `emotion_model.joblib` is in the project root directory.

If the file is missing, you'll need to train the model first (see Step 4 - Optional).

## 🎯 Step 4: Train the Model (Optional)

**Skip this step if `emotion_model.joblib` already exists.**

1. Open `train_emotion_model.py` and update the dataset path:
```python
DATASET_PATH = "ASED_V1-main"  # Update this to your dataset path
```

2. Run the training script:
```bash
python train_emotion_model.py
```

This will:
- Load audio files from the dataset
- Extract features
- Train a Random Forest model
- Save the model as `emotion_model.joblib`

**Note**: Training may take several minutes depending on your system.

## 🖥️ Step 5: Start the Backend Server

1. Open a terminal in the project root directory.

2. Activate your virtual environment (if you created one):
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Start the FastAPI server:
```bash
uvicorn app:app --reload --port 8000
```

You should see output like:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Model loaded successfully
INFO:     Application startup complete.
```

✅ **Backend is now running on `http://localhost:8000`**

Keep this terminal window open!

## 🌐 Step 6: Start the Frontend Development Server

1. Open a **NEW** terminal window in the project root directory.

2. Start the Vite development server:
```bash
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Frontend is now running on `http://localhost:5173`**

## 🎉 Step 7: Use the Application

1. Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```

2. You should see the Speech Emotion Recognition interface.

3. **To analyze audio:**
   - **Option 1 - Upload File**: Click "Audio Upload" tab → Select a WAV audio file → View results
   - **Option 2 - Live Recording**: Click "Live Recording" tab → Click record → Speak → Stop → View results

## 📝 Quick Start (All Commands)

If you've already set up everything before, here's the quick start:

**Terminal 1 (Backend):**
```bash
# Activate venv (if using one)
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Start backend
uvicorn app:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

## 🔍 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError` or import errors
- **Solution**: Make sure all dependencies are installed: `pip install -r requirements.txt`
- Make sure your virtual environment is activated

**Problem**: `emotion_model.joblib` not found
- **Solution**: Train the model first (Step 4) or ensure the file exists in the project root

**Problem**: Port 8000 already in use
- **Solution**: Use a different port: `uvicorn app:app --reload --port 8001`
- Then update `API_URL` in `src/api/emotionAPI.ts` to match

**Problem**: Audio file processing errors
- **Solution**: Ensure audio files are in WAV format. The system supports common audio formats, but WAV is recommended.

### Frontend Issues

**Problem**: `npm install` fails
- **Solution**: 
  - Delete `node_modules` folder and `package-lock.json`
  - Run `npm install` again
  - Or try: `npm cache clean --force` then `npm install`

**Problem**: Frontend can't connect to backend
- **Solution**: 
  - Ensure backend is running on port 8000
  - Check `src/api/emotionAPI.ts` - API_URL should be `http://localhost:8000`
  - Check browser console for CORS errors

**Problem**: Build errors
- **Solution**: 
  - Make sure Node.js version is 16+
  - Try deleting `node_modules` and reinstalling
  - Check for TypeScript errors: `npm run lint`

### General Issues

**Problem**: CORS errors in browser console
- **Solution**: The backend already has CORS enabled. If issues persist, check that both servers are running.

**Problem**: Model predictions seem incorrect
- **Solution**: 
  - Ensure audio quality is good
  - Try with different audio samples
  - Check that the model file is not corrupted

## 🛑 Stopping the Servers

- **Backend**: Press `Ctrl+C` in the backend terminal
- **Frontend**: Press `Ctrl+C` in the frontend terminal

## 📚 Additional Information

- **Backend API Docs**: Once backend is running, visit `http://localhost:8000/docs` for interactive API documentation
- **Backend Health Check**: Visit `http://localhost:8000` to see if the server is running
- **Frontend Build**: Run `npm run build` to create a production build in the `dist/` folder

## 🎯 Next Steps

- Try uploading different audio files
- Test the live recording feature
- Check the API documentation at `http://localhost:8000/docs`
- Explore the code to understand how it works!

---

**Need Help?** Open an issue on GitHub or check the main README.md for more details.


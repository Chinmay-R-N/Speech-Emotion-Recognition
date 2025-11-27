import React, { useState } from 'react';
import { Brain, AudioWaveform as Waveform } from 'lucide-react';
import { AudioUploader } from './components/AudioUploader';
import { LiveRecorder } from './components/LiveRecorder';
import { EmotionResult } from './components/EmotionResult';
import { EmotionAnalysis } from './types/emotion';

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<EmotionAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');

  const handleAnalysisComplete = (analysis: EmotionAnalysis) => {
    console.log('Analysis received in App:', analysis);
    setCurrentAnalysis(analysis);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Speech Emotion Recognition
                </h1>
                <p className="text-purple-200 mt-1">
                  Advanced AI-powered emotion analysis using RAVDESS dataset
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
              <Waveform className="w-5 h-5 text-purple-300" />
              <span className="text-purple-200 text-sm font-medium">Deep Learning Model</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'upload'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white hover:text-purple-200'
                }`}
              >
                Audio Upload
              </button>
              <button
                onClick={() => setActiveTab('record')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'record'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white hover:text-purple-200'
                }`}
              >
                Live Recording
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            {activeTab === 'upload' ? (
              <AudioUploader onAnalysisComplete={handleAnalysisComplete} />
            ) : (
              <LiveRecorder onAnalysisComplete={handleAnalysisComplete} />
            )}
          </div>

          {/* Results Section */}
          <div>
            {currentAnalysis ? (
              <EmotionResult analysis={currentAnalysis} />
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 text-center">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Ready for Analysis
                </h3>
                <p className="text-purple-200">
                  {activeTab === 'upload' 
                    ? 'Upload an audio file to see detailed emotion analysis'
                    : 'Start recording to analyze your speech emotions in real-time'
                  }
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-purple-200">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="font-medium mb-1">Supported Emotions</div>
                    <div className="text-xs">Happy, Sad, Angry, Fearful, Calm, Neutral, Disgust, Surprised</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="font-medium mb-1">AI Model</div>
                    <div className="text-xs">Deep Learning trained on RAVDESS dataset</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">High Accuracy</h3>
            <p className="text-purple-200 text-sm">
              Advanced deep learning model trained on the RAVDESS dataset for precise emotion recognition
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Waveform className="w-6 h-6 text-green-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Analysis</h3>
            <p className="text-purple-200 text-sm">
              Live audio processing with visual feedback and instant emotion detection results
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">8 Emotions</h3>
            <p className="text-purple-200 text-sm">
              Detects neutral, calm, happy, sad, angry, fearful, disgust, and surprised emotions
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
import React, { useState, useRef } from 'react';
import { Upload, Play, Pause, Volume2, FileAudio, Loader2 } from 'lucide-react';
import { predictEmotion } from '../api/emotionAPI';
import { EmotionAnalysis } from '../types/emotion';

interface AudioUploaderProps {
  onAnalysisComplete: (analysis: EmotionAnalysis) => void;
  className?: string;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onAnalysisComplete, className = '' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      
      // Clean up previous URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      // Create new URL for the audio file
      const newAudioUrl = URL.createObjectURL(selectedFile);
      setAudioUrl(newAudioUrl);
      
      if (audioRef.current) {
        audioRef.current.src = newAudioUrl;
        audioRef.current.load(); // Force reload of the audio element
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const togglePlayback = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('Playback failed:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('Audio error:', e);
    setIsPlaying(false);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      console.log('Starting analysis for file:', file.name);
      const analysis = await predictEmotion(file);
      console.log('Analysis completed:', analysis);
      onAnalysisComplete(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze audio. Please try with a different file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Cleanup URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <FileAudio className="w-6 h-6 text-blue-300" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Audio File Analysis</h3>
          <p className="text-sm text-purple-200">Upload an audio file to analyze emotions</p>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
          dragOver
            ? 'border-blue-400 bg-blue-500/10'
            : file
            ? 'border-green-400 bg-green-500/10'
            : 'border-white/30 bg-white/5 hover:border-white/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        
        {file ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <FileAudio className="w-8 h-8 text-green-300" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">{file.name}</p>
              <p className="text-sm text-purple-200">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-white/60" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">Drop your audio file here</p>
              <p className="text-sm text-purple-200">or click to browse (MP3, WAV, M4A, etc.)</p>
            </div>
          </div>
        )}
      </div>

      {/* Audio Controls */}
      {file && audioUrl && (
        <div className="mt-6 space-y-4">
          <audio
            ref={audioRef}
            onEnded={handleAudioEnded}
            onError={handleAudioError}
            preload="metadata"
            className="hidden"
          />
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={togglePlayback}
              disabled={!audioUrl}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <div className="flex items-center gap-2 text-purple-200">
              <Volume2 className="w-5 h-5" />
              <span className="text-sm">Preview Audio</span>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Emotions'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
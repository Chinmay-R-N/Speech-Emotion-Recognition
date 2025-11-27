import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { predictEmotion } from '../api/emotionAPI';
import { EmotionAnalysis } from '../types/emotion';

interface LiveRecorderProps {
  onAnalysisComplete: (analysis: EmotionAnalysis) => void;
  className?: string;
}

export const LiveRecorder: React.FC<LiveRecorderProps> = ({ onAnalysisComplete, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        
        setIsAnalyzing(true);
        try {
          const analysis = await predictEmotion(audioFile);
          onAnalysisComplete(analysis);
        } catch (error) {
          console.error('Analysis failed:', error);
          alert('Failed to analyze audio. Please try recording again.');
        } finally {
          setIsAnalyzing(false);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-500/20 rounded-lg">
          <Mic className="w-6 h-6 text-red-300" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Live Recording</h3>
          <p className="text-sm text-purple-200">Record audio to analyze emotions in real-time</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-8">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500/20 animate-pulse' 
            : 'bg-white/10'
        }`}>
          <Mic className={`w-12 h-12 ${
            isRecording 
              ? 'text-red-300' 
              : 'text-white/60'
          }`} />
        </div>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
          } text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing...
            </>
          ) : isRecording ? (
            <>
              <Square className="w-6 h-6" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              Start Recording
            </>
          )}
        </button>

        {isRecording && (
          <p className="mt-4 text-sm text-purple-200">
            Recording in progress... Click stop when finished
          </p>
        )}
      </div>
    </div>
  );
};
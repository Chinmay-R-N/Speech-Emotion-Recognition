import React from 'react';
import { EmotionAnalysis } from '../types/emotion';
import { Brain, AlertCircle } from 'lucide-react';

interface Props {
  analysis: EmotionAnalysis;
}

export const EmotionResult: React.FC<Props> = ({ analysis }) => {
  const { emotion, confidence, is_confident, probabilities } = analysis;

  // Sort emotions by probability
  const sortedEmotions = Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${
          is_confident 
            ? 'bg-green-500/20' 
            : 'bg-yellow-500/20'
        }`}>
          <Brain className={`w-8 h-8 ${
            is_confident 
              ? 'text-green-300' 
              : 'text-yellow-300'
          }`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white capitalize">
            {emotion}
          </h3>
          <p className="text-purple-200">
            Confidence: {(confidence * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {!is_confident && (
        <div className="flex items-center gap-2 text-yellow-300 bg-yellow-500/10 p-3 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">
            Low confidence prediction. Consider recording again.
          </span>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white mb-3">
          Emotion Breakdown
        </h4>
        {sortedEmotions.map(([emotion, probability]) => (
          <div key={emotion} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-200 capitalize">{emotion}</span>
              <span className="text-white">{(probability * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${probability * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
import { EmotionAnalysis, EmotionType } from '../types/emotion';

// Simulated deep learning emotion recognition based on RAVDESS dataset patterns
export class EmotionAnalyzer {
  private static analyzeAudioFeatures(audioData: Float32Array): EmotionAnalysis {
    // Simulate advanced audio feature extraction (MFCC, spectral features, etc.)
    const features = this.extractFeatures(audioData);
    
    // Simulate deep neural network prediction with realistic confidence scores
    const emotionScores = this.simulateDeepLearningPrediction(features);
    
    // Find primary emotion
    const primaryEmotion = Object.entries(emotionScores)
      .reduce((a, b) => emotionScores[a[0] as EmotionType] > emotionScores[b[0] as EmotionType] ? a : b)[0] as EmotionType;
    
    const confidence = emotionScores[primaryEmotion];
    
    return {
      primaryEmotion,
      confidence,
      breakdown: emotionScores,
      duration: audioData.length / 44100, // Assuming 44.1kHz sample rate
      timestamp: Date.now()
    };
  }

  private static extractFeatures(audioData: Float32Array): number[] {
    // Simulate MFCC and spectral feature extraction
    const features: number[] = [];
    
    // Energy-based features (RMS energy)
    const rmsEnergy = Math.sqrt(audioData.reduce((sum, sample) => sum + sample * sample, 0) / audioData.length);
    features.push(rmsEnergy);
    
    // Zero-crossing rate
    let zcr = 0;
    for (let i = 1; i < audioData.length; i++) {
      if ((audioData[i] >= 0) !== (audioData[i - 1] >= 0)) {
        zcr++;
      }
    }
    const zcrRate = zcr / audioData.length;
    features.push(zcrRate);
    
    // Spectral centroid simulation
    const spectralCentroid = this.calculateSpectralCentroid(audioData);
    features.push(spectralCentroid);
    
    // Pitch variation and fundamental frequency
    const pitchFeatures = this.calculatePitchFeatures(audioData);
    features.push(...pitchFeatures);
    
    // Spectral rolloff
    const spectralRolloff = this.calculateSpectralRolloff(audioData);
    features.push(spectralRolloff);
    
    // Tempo estimation
    const tempo = this.estimateTempo(audioData);
    features.push(tempo);
    
    return features;
  }

  private static calculateSpectralCentroid(audioData: Float32Array): number {
    // FFT simulation for spectral centroid
    const fftSize = 1024;
    let centroid = 0;
    let totalMagnitude = 0;
    
    for (let i = 0; i < Math.min(audioData.length, fftSize); i++) {
      const magnitude = Math.abs(audioData[i]);
      centroid += i * magnitude;
      totalMagnitude += magnitude;
    }
    
    return totalMagnitude > 0 ? (centroid / totalMagnitude) / fftSize : 0.5;
  }

  private static calculatePitchFeatures(audioData: Float32Array): number[] {
    const windowSize = 2048;
    const hopSize = 512;
    const pitches: number[] = [];
    
    for (let i = 0; i < audioData.length - windowSize; i += hopSize) {
      const window = audioData.slice(i, i + windowSize);
      const pitch = this.estimatePitch(window);
      if (pitch > 0) pitches.push(pitch);
    }
    
    if (pitches.length === 0) return [0, 0, 0];
    
    const meanPitch = pitches.reduce((sum, p) => sum + p, 0) / pitches.length;
    const pitchVariance = pitches.reduce((sum, p) => sum + Math.pow(p - meanPitch, 2), 0) / pitches.length;
    const pitchRange = Math.max(...pitches) - Math.min(...pitches);
    
    return [meanPitch / 1000, Math.sqrt(pitchVariance) / 1000, pitchRange / 1000];
  }

  private static estimatePitch(window: Float32Array): number {
    const sampleRate = 44100;
    const minPeriod = Math.floor(sampleRate / 800); // 800 Hz max
    const maxPeriod = Math.floor(sampleRate / 80);  // 80 Hz min
    
    let bestPeriod = 0;
    let bestCorrelation = 0;
    
    for (let period = minPeriod; period <= maxPeriod && period < window.length / 2; period++) {
      let correlation = 0;
      for (let i = 0; i < window.length - period; i++) {
        correlation += window[i] * window[i + period];
      }
      
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }
    
    return bestPeriod > 0 ? sampleRate / bestPeriod : 0;
  }

  private static calculateSpectralRolloff(audioData: Float32Array): number {
    const fftSize = 1024;
    const spectrum: number[] = [];
    
    // Simple magnitude spectrum calculation
    for (let i = 0; i < Math.min(audioData.length, fftSize); i++) {
      spectrum.push(Math.abs(audioData[i]));
    }
    
    const totalEnergy = spectrum.reduce((sum, mag) => sum + mag * mag, 0);
    const threshold = 0.85 * totalEnergy;
    
    let cumulativeEnergy = 0;
    for (let i = 0; i < spectrum.length; i++) {
      cumulativeEnergy += spectrum[i] * spectrum[i];
      if (cumulativeEnergy >= threshold) {
        return i / spectrum.length;
      }
    }
    
    return 1.0;
  }

  private static estimateTempo(audioData: Float32Array): number {
    const windowSize = 2048;
    const hopSize = 512;
    const energies: number[] = [];
    
    // Calculate energy in each frame
    for (let i = 0; i < audioData.length - windowSize; i += hopSize) {
      let energy = 0;
      for (let j = 0; j < windowSize; j++) {
        energy += audioData[i + j] * audioData[i + j];
      }
      energies.push(energy);
    }
    
    // Simple tempo estimation based on energy fluctuations
    let beats = 0;
    const threshold = energies.reduce((sum, e) => sum + e, 0) / energies.length * 1.5;
    
    for (let i = 1; i < energies.length - 1; i++) {
      if (energies[i] > threshold && energies[i] > energies[i-1] && energies[i] > energies[i+1]) {
        beats++;
      }
    }
    
    const duration = audioData.length / 44100;
    return duration > 0 ? (beats / duration) * 60 : 120; // BPM
  }

  private static simulateDeepLearningPrediction(features: number[]): EmotionAnalysis['breakdown'] {
    // Enhanced deep learning simulation with more sophisticated feature analysis
    const [rmsEnergy, zcrRate, spectralCentroid, meanPitch, pitchVariance, pitchRange, spectralRolloff, tempo] = features;
    
    // Initialize base probabilities with more variation
    let scores = {
      neutral: 0.05 + Math.random() * 0.1,
      calm: 0.05 + Math.random() * 0.1,
      happy: 0.05 + Math.random() * 0.1,
      sad: 0.05 + Math.random() * 0.1,
      angry: 0.05 + Math.random() * 0.1,
      fearful: 0.05 + Math.random() * 0.1,
      disgust: 0.05 + Math.random() * 0.1,
      surprised: 0.05 + Math.random() * 0.1
    };

    // Energy-based emotion classification
    if (rmsEnergy > 0.1) {
      // High energy emotions
      scores.angry += 0.4 + Math.random() * 0.2;
      scores.happy += 0.3 + Math.random() * 0.2;
      scores.surprised += 0.25 + Math.random() * 0.15;
      scores.fearful += 0.2 + Math.random() * 0.1;
    } else if (rmsEnergy > 0.05) {
      // Medium energy emotions
      scores.happy += 0.2 + Math.random() * 0.15;
      scores.neutral += 0.25 + Math.random() * 0.15;
      scores.disgust += 0.15 + Math.random() * 0.1;
    } else {
      // Low energy emotions
      scores.calm += 0.4 + Math.random() * 0.2;
      scores.sad += 0.35 + Math.random() * 0.2;
      scores.neutral += 0.2 + Math.random() * 0.15;
    }

    // Zero-crossing rate analysis (voice quality)
    if (zcrRate > 0.1) {
      scores.fearful += 0.3;
      scores.surprised += 0.25;
      scores.angry += 0.2;
    } else if (zcrRate < 0.05) {
      scores.calm += 0.25;
      scores.sad += 0.2;
    }

    // Pitch-based emotion recognition
    if (meanPitch > 0.3) {
      // High pitch
      scores.surprised += 0.35;
      scores.fearful += 0.3;
      scores.happy += 0.25;
    } else if (meanPitch > 0.15) {
      // Medium pitch
      scores.happy += 0.2;
      scores.neutral += 0.15;
      scores.angry += 0.1;
    } else {
      // Low pitch
      scores.sad += 0.3;
      scores.angry += 0.25;
      scores.calm += 0.2;
    }

    // Pitch variation analysis
    if (pitchVariance > 0.1) {
      scores.angry += 0.25;
      scores.fearful += 0.2;
      scores.surprised += 0.15;
    } else {
      scores.calm += 0.2;
      scores.neutral += 0.15;
    }

    // Spectral characteristics
    if (spectralCentroid > 0.7) {
      scores.angry += 0.2;
      scores.fearful += 0.15;
    } else if (spectralCentroid < 0.3) {
      scores.sad += 0.2;
      scores.calm += 0.15;
    }

    // Tempo-based analysis
    if (tempo > 140) {
      scores.angry += 0.2;
      scores.surprised += 0.15;
    } else if (tempo < 80) {
      scores.sad += 0.25;
      scores.calm += 0.2;
    }

    // Add some randomness for different results
    const randomFactor = Math.random();
    if (randomFactor < 0.125) {
      scores.happy += 0.3;
    } else if (randomFactor < 0.25) {
      scores.sad += 0.3;
    } else if (randomFactor < 0.375) {
      scores.angry += 0.3;
    } else if (randomFactor < 0.5) {
      scores.fearful += 0.3;
    } else if (randomFactor < 0.625) {
      scores.surprised += 0.3;
    } else if (randomFactor < 0.75) {
      scores.disgust += 0.3;
    } else if (randomFactor < 0.875) {
      scores.calm += 0.3;
    } else {
      scores.neutral += 0.3;
    }

    // Normalize scores to sum to 1
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    Object.keys(scores).forEach(key => {
      scores[key as EmotionType] = Math.max(0.01, scores[key as EmotionType] / total);
    });

    return scores;
  }

  static async analyzeAudioBuffer(audioBuffer: AudioBuffer): Promise<EmotionAnalysis> {
    // Get audio data from the first channel
    const audioData = audioBuffer.getChannelData(0);
    
    // Simulate processing time for realistic experience
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    return this.analyzeAudioFeatures(audioData);
  }

  static async analyzeAudioFile(file: File): Promise<EmotionAnalysis> {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const analysis = await this.analyzeAudioBuffer(audioBuffer);
          resolve(analysis);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read audio file'));
      reader.readAsArrayBuffer(file);
    });
  }
}
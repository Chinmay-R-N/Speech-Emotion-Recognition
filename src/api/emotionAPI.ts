import axios from "axios";
import { EmotionAnalysis } from "../types/emotion";

const API_URL = "http://localhost:8000"; // Or your deployed backend URL

export const predictEmotion = async (file: File): Promise<EmotionAnalysis> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log('Sending request to API...');
    const response = await axios.post(`${API_URL}/predict`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log('API Response:', response.data);

    // Ensure the response matches our expected format
    const data = response.data;
    if (!data.emotion || !data.confidence || !data.is_confident || !data.probabilities) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid response format from API');
    }

    const result = {
      emotion: data.emotion,
      confidence: data.confidence,
      is_confident: data.is_confident,
      probabilities: data.probabilities
    };

    console.log('Processed result:', result);
    return result;
  } catch (error) {
    console.error('API Error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    throw new Error('Failed to analyze audio. Please try again.');
  }
};

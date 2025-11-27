import React, { useState } from "react";
import { predictEmotion } from "../api/emotionAPI";

export default function EmotionUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const result = await predictEmotion(selectedFile);
      setEmotion(result);
    } catch (error) {
      console.error("Prediction failed:", error);
      setEmotion("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl shadow-xl bg-white space-y-4">
      <input type="file" accept=".wav" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        {loading ? "Predicting..." : "Predict Emotion"}
      </button>
      {emotion && (
        <div className="text-lg font-semibold text-green-600">
          Detected Emotion: {emotion}
        </div>
      )}
    </div>
  );
}

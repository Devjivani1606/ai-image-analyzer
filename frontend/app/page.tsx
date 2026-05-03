"use client";
import { useState } from "react";
import axios from "axios";

interface AnalysisResult {
  labels: string[];
  audioUrl: string;
}

export default function Home() {
const [files, setFiles] = useState<File[]>([]);
const [results, setResults] = useState<AnalysisResult[]>([]);
const [isUploading, setIsUploading] = useState(false);

 const handleUpload = async () => {
  if (!files.length) return;

  setIsUploading(true);

  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const res = await axios.post("http://localhost:5000/upload", formData);

    setResults(res.data);
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    setIsUploading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Image Analyzer</h1>

        <div className="space-y-4">
         <input 
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button 
            onClick={handleUpload}
            disabled={!files.length || isUploading}
            className={`w-full py-2 px-4 rounded-lg transition duration-200 ${
              !files.length || isUploading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isUploading ? "Processing..." : `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>

       {results.length > 0 && (
  <div className="mt-6 space-y-4">
    {results.map((item, index) => (
      <div key={index} className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700 mb-2">
          {item.labels.join(", ")}
        </p>
        <audio controls src={item.audioUrl} className="w-full"></audio>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}
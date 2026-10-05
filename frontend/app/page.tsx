"use client";

import { useState, useRef } from "react";
import axios from "axios";

interface BoundingBox {
  Width: number;
  Height: number;
  Left: number;
  Top: number;
}

interface DetectedObject {
  name: string;
  confidence: number;
  boundingBox: BoundingBox;
}

interface AnalysisResult {
  imageUrl: string;
  labels: string[];
  objects: DetectedObject[];
  audioUrl: string;
  dbSaved?: boolean;
  dbError?: string | null;
}

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hoveredObjectIdx, setHoveredObjectIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);

    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    setResults([]);
    setErrorMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    setIsUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.post("http://localhost:5000/upload", formData);
      setResults(res.data);
    } catch (error: unknown) {
      console.error("Upload failed:", error);
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message || error.response?.data?.error;
        setErrorMessage(serverMessage || error.message);
      } else {
        setErrorMessage("Upload failed. Please ensure the backend server is running on port 5000.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setResults([]);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased selection:bg-zinc-200">
      
      {/* Minimal Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <div>
              <h1 className="text-base font-semibold text-zinc-900 tracking-tight">
                Image Vision & Voice
              </h1>
              <p className="text-xs text-zinc-500">Object Detection & Speech Synthesis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        
        {/* Upload Box */}
        <section className="bg-white border border-zinc-200 rounded-xl p-8 shadow-sm">
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-zinc-300 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-50 transition-all rounded-lg p-10 text-center cursor-pointer flex flex-col items-center justify-center gap-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files)}
            />

            <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-800">
                Click or drop images here
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                JPEG, PNG, WEBP files
              </p>
            </div>
          </div>

          {/* Selected File Previews & Action */}
          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-4 pt-4 border-t border-zinc-100">
              
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected</span>
                <button 
                  onClick={clearSelection}
                  className="text-zinc-400 hover:text-zinc-700 underline"
                >
                  Clear
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex flex-wrap gap-2">
                {previews.map((src, idx) => (
                  <img key={idx} src={src} alt="Preview" className="w-16 h-16 object-cover rounded-md border border-zinc-200" />
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Upload & Analyze Image</span>
                )}
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
              {errorMessage}
            </div>
          )}
        </section>

        {/* Results Section */}
        {results.length > 0 && (
          <section className="space-y-8">
            
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
              Results ({results.length})
            </h2>

            {results.map((result, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Image Display with White Square Bracket Overlays */}
                <div className="md:col-span-7 flex flex-col items-center">
                  
                  <div className="relative w-full rounded-lg overflow-hidden border border-zinc-200 bg-zinc-950 flex items-center justify-center">
                    
                    {/* Image */}
                    <img
                      src={result.imageUrl}
                      alt="Analyzed"
                      className="w-full h-auto max-h-[450px] object-contain block"
                    />

                    {/* White Square Brackets */}
                    {result.objects && result.objects.map((obj, objIdx) => {
                      const isHovered = hoveredObjectIdx === objIdx;
                      const leftPct = (obj.boundingBox.Left * 100).toFixed(2);
                      const topPct = (obj.boundingBox.Top * 100).toFixed(2);
                      const widthPct = (obj.boundingBox.Width * 100).toFixed(2);
                      const heightPct = (obj.boundingBox.Height * 100).toFixed(2);

                      return (
                        <div
                          key={objIdx}
                          onMouseEnter={() => setHoveredObjectIdx(objIdx)}
                          onMouseLeave={() => setHoveredObjectIdx(null)}
                          className="absolute transition-all duration-150 pointer-events-auto"
                          style={{
                            left: `${leftPct}%`,
                            top: `${topPct}%`,
                            width: `${widthPct}%`,
                            height: `${heightPct}%`,
                            boxShadow: isHovered 
                              ? "0 0 15px rgba(255, 255, 255, 0.9)" 
                              : "0 0 5px rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          {/* White Square Bracket Box */}
                          <div className={`absolute inset-0 border-2 border-white rounded-xs ${isHovered ? "bg-white/20" : "bg-white/5"}`}>
                            {/* Corner bracket ticks */}
                            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white"></div>
                          </div>

                          {/* White Label Pill */}
                          <span className="absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-bold bg-white text-zinc-900 rounded shadow-sm whitespace-nowrap">
                            [{obj.name}] {obj.confidence}%
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-2">
                    {result.objects && result.objects.length > 0 
                      ? "White square brackets highlight detected objects."
                      : "No individual bounding box objects found."}
                  </p>
                </div>

                {/* Info & Speech Control */}
                <div className="md:col-span-5 space-y-6">
                  
                  {/* Speech Audio Bar */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-2">
                    <div className="text-xs font-semibold text-zinc-700 flex items-center justify-between">
                      <span>Audio Speech (English)</span>
                      <span className="text-[10px] text-zinc-400">AWS Polly</span>
                    </div>

                    <audio controls autoPlay src={result.audioUrl} className="w-full h-8"></audio>

                    <p className="text-xs text-zinc-600 italic bg-white p-2 rounded border border-zinc-200">
                      "This image contains: {result.labels.slice(0, 5).join(", ")}"
                    </p>
                  </div>

                  {/* Detected Object Buttons */}
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 mb-2">
                      Detected Objects ({result.objects ? result.objects.length : 0})
                    </h3>

                    {result.objects && result.objects.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {result.objects.map((obj, objIdx) => (
                          <button
                            key={objIdx}
                            onMouseEnter={() => setHoveredObjectIdx(objIdx)}
                            onMouseLeave={() => setHoveredObjectIdx(null)}
                            className={`px-2.5 py-1 rounded text-xs font-medium border transition ${
                              hoveredObjectIdx === objIdx
                                ? "bg-zinc-900 text-white border-zinc-900"
                                : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                            }`}
                          >
                            [{obj.name}] <span className="opacity-60 text-[10px]">{obj.confidence}%</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400">No objects identified.</p>
                    )}
                  </div>

                  {/* All Categories */}
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 mb-2">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {result.labels.map((label, lIdx) => (
                        <span key={lIdx} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-xs">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                    <span>DynamoDB Log:</span>
                    <span className={result.dbSaved ? "text-emerald-600" : "text-amber-600"}>
                      {result.dbSaved ? "Saved" : "Not Saved"}
                    </span>
                  </div>

                </div>

              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

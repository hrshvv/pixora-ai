"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Paintbrush,
  Eraser,
  RotateCcw,
  Sparkles,
  Info,
  ExternalLink,
} from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { formatBytes } from "@/lib/utils";
import type { UploadedImageInfo } from "@/types/upload";

export default function EditorPage() {
  const [activeImage, setActiveImage] = useState<UploadedImageInfo | null>(null);
  const [brushSize, setBrushSize] = useState<number>(30);
  const [brushMode, setBrushMode] = useState<"draw" | "erase">("draw");
  const [prompt, setPrompt] = useState<string>("");

  useEffect(() => {
    // Restore image from session storage if available
    const saved = sessionStorage.getItem("pixora_active_image");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UploadedImageInfo;
        setActiveImage(parsed);
      } catch (e) {
        console.error("Failed to parse saved active image", e);
      }
    }
  }, []);

  const handleUploadSuccess = (uploaded: UploadedImageInfo) => {
    setActiveImage(uploaded);
    sessionStorage.setItem("pixora_active_image", JSON.stringify(uploaded));
  };

  const handleClearImage = () => {
    sessionStorage.removeItem("pixora_active_image");
    setActiveImage(null);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Top Navigation */}
      <header className="flex h-14 items-center justify-between border-b border-border/60 bg-card/60 px-4 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-border/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-foreground">Pixora AI</span>
            <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-medium text-violet-400">
              Editor
            </span>
          </div>
        </div>

        {activeImage && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearImage}
              className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Change Image</span>
            </button>
            <a
              href={activeImage.secureUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition"
              title="Open full resolution in Cloudinary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Source</span>
            </a>
          </div>
        )}
      </header>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* If no image uploaded yet, show upload stage */}
        {!activeImage ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8">
            <div className="max-w-xl text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                Upload image to start editing
              </h1>
              <p className="text-sm text-muted-foreground">
                Your photo will be uploaded directly to Cloudinary and loaded ready for generative
                fill.
              </p>
            </div>
            <ImageUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <>
            {/* Left Toolbar (Brush Controls) */}
            <aside className="w-16 border-r border-border/60 bg-card/40 flex flex-col items-center py-4 gap-4 z-10">
              <button
                onClick={() => setBrushMode("draw")}
                className={`p-2.5 rounded-xl transition ${
                  brushMode === "draw"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                title="Brush (B)"
              >
                <Paintbrush className="h-5 w-5" />
              </button>

              <button
                onClick={() => setBrushMode("erase")}
                className={`p-2.5 rounded-xl transition ${
                  brushMode === "erase"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                title="Eraser (E)"
              >
                <Eraser className="h-5 w-5" />
              </button>

              <div className="w-8 h-px bg-border/60 my-1" />

              <button
                onClick={() => {}}
                className="p-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                title="Reset Mask"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </aside>

            {/* Central Canvas Workspace */}
            <main className="flex-1 relative bg-neutral-950 flex items-center justify-center overflow-hidden p-6">
              <div className="relative max-h-full max-w-full rounded-lg overflow-hidden border border-border/40 shadow-2xl bg-neutral-900/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage.secureUrl}
                  alt={activeImage.originalFilename || "Uploaded asset"}
                  className="max-h-[calc(100vh-140px)] w-auto object-contain select-none pointer-events-none"
                />

                {/* Mask Overlay simulation for upload stage */}
                <div className="absolute inset-0 pointer-events-none flex items-end justify-start p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="rounded-md bg-black/70 px-2 py-1 text-[11px] text-zinc-300 backdrop-blur-sm border border-white/10 flex items-center gap-2">
                    <span>
                      {activeImage.width} × {activeImage.height}px
                    </span>
                    <span>•</span>
                    <span>{formatBytes(activeImage.bytes)}</span>
                    <span>•</span>
                    <span className="uppercase text-violet-400 font-medium">
                      {activeImage.format}
                    </span>
                  </div>
                </div>
              </div>
            </main>

            {/* Right Generation & Settings Panel */}
            <aside className="w-80 border-l border-border/60 bg-card/40 flex flex-col justify-between p-4 z-10 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Generative Fill</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Brush a region on the canvas and describe what to inpaint.
                  </p>
                </div>

                {/* Brush Size Adjustment */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Brush Size</span>
                    <span className="font-mono text-foreground">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>

                {/* Prompt Input */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">
                    Describe what to fill
                  </label>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. A wooden bookshelf filled with books, matching the room's lighting"
                    className="w-full rounded-xl border border-border/60 bg-secondary/50 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition"
                  />
                  <div className="flex gap-1 flex-wrap">
                    {["Add soft clouds", "Wooden floor", "Warm sunlight"].map((pill) => (
                      <button
                        key={pill}
                        onClick={() => setPrompt(pill)}
                        className="rounded-full border border-border/60 bg-secondary/30 px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:border-violet-500/50 transition"
                      >
                        +{pill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cloudinary Storage Details */}
                <div className="rounded-xl border border-border/60 bg-secondary/20 p-3 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Info className="h-3.5 w-3.5 text-violet-400" />
                    <span>Cloud Storage Info</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <div className="truncate">
                      <span className="text-zinc-500">ID:</span> {activeImage.publicId}
                    </div>
                    <div>
                      <span className="text-zinc-500">Dimensions:</span> {activeImage.width} ×{" "}
                      {activeImage.height}
                    </div>
                    <div>
                      <span className="text-zinc-500">Status:</span>{" "}
                      <span className="text-emerald-400 font-medium">Ready in CDN</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2">
                <button
                  disabled={!prompt.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Fill (Next Stage)</span>
                </button>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}

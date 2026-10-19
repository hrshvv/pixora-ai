"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, Image as ImageIcon, AlertCircle, Loader2 } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { uploadImageToCloudinary } from "@/services/uploadService";
import type { UploadedImageInfo } from "@/types/upload";

interface ImageUploaderProps {
  onUploadSuccess: (image: UploadedImageInfo) => void;
  className?: string;
}

export function ImageUploader({ onUploadSuccess, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (file: File) => {
    setError(null);

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a supported image file (JPEG, PNG, WebP, or AVIF).");
      return;
    }

    // Validate size (defaults to 10MB)
    const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB) || 10;
    if (file.size > maxMb * 1024 * 1024) {
      setError(`Image exceeds maximum allowed size of ${maxMb}MB (${formatBytes(file.size)}).`);
      return;
    }

    // Set local preview immediately for UX
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    try {
      const uploadedData = await uploadImageToCloudinary(file);
      onUploadSuccess(uploadedData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image. Please try again.";
      setError(msg);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto flex flex-col gap-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center min-h-[320px] rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer select-none",
          isDragging
            ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
            : "border-border/80 bg-card/40 hover:bg-card/70 hover:border-violet-500/50",
          isUploading && "pointer-events-none opacity-80 cursor-wait"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/avif"
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-4 text-center">
            {previewUrl ? (
              <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-border/80 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Uploading preview"
                  className="h-full w-full object-cover blur-sm brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              </div>
            ) : (
              <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
            )}
            <div>
              <p className="font-semibold text-foreground">Uploading image to Cloudinary...</p>
              <p className="text-sm text-muted-foreground">Optimizing and storing safely</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-500 transition-transform group-hover:scale-110">
              <UploadCloud className="h-8 w-8" />
            </div>

            <div>
              <p className="text-base font-semibold text-foreground">
                Drag and drop your image here, or{" "}
                <span className="text-violet-400 underline underline-offset-4">browse</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supports PNG, JPG, WebP or AVIF (Up to 10MB)
              </p>
            </div>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs text-muted-foreground">
              <ImageIcon className="h-3.5 w-3.5 text-violet-400" />
              <span>Full resolution preserved for editing</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

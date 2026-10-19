"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wand2, ShieldCheck, Zap, Sliders, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { useRouter } from "next/navigation";
import type { UploadedImageInfo } from "@/types/upload";

export default function HomePage() {
  const router = useRouter();
  const [lastUploaded, setLastUploaded] = useState<UploadedImageInfo | null>(null);

  const handleUploadSuccess = (uploaded: UploadedImageInfo) => {
    setLastUploaded(uploaded);
    sessionStorage.setItem("pixora_active_image", JSON.stringify(uploaded));
    // Navigate straight to editor with image loaded
    router.push("/editor");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-violet-500/30">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-background to-background pointer-events-none" />

          <div className="container mx-auto max-w-5xl px-4 sm:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-medium text-violet-400 mb-6">
              <Wand2 className="h-3.5 w-3.5" />
              <span>Generative Fill & AI Inpainting</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
              Fill the gaps. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
                Imagine more.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed">
              Select any part of an image, describe what belongs there, and let AI bring your vision
              to life. No complicated editing workflow required.
            </p>

            {/* Direct Uploader on Landing Page */}
            <div className="mt-4">
              <ImageUploader onUploadSuccess={handleUploadSuccess} />
            </div>

            {lastUploaded && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Uploaded successfully! Redirecting to editor...</span>
              </div>
            )}
          </div>
        </section>

        {/* 3 Step Workflow */}
        <section className="py-20 border-b border-border/40 bg-card/20">
          <div className="container mx-auto max-w-5xl px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                How Pixora AI Works
              </h2>
              <p className="mt-2 text-muted-foreground text-sm">
                Three straightforward steps from your original photo to generative AI perfection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/60 bg-card/40">
                <div className="h-12 w-12 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Upload Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Drop any high-resolution image. Your photo is securely stored on Cloudinary.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/60 bg-card/40">
                <div className="h-12 w-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Brush Mask</h3>
                <p className="text-sm text-muted-foreground">
                  Highlight precisely what you want to add, remove, or replace with brush controls.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/60 bg-card/40">
                <div className="h-12 w-12 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Describe & Fill</h3>
                <p className="text-sm text-muted-foreground">
                  Provide your prompt. AI seamlessly generates content matching the exact scene lighting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20">
          <div className="container mx-auto max-w-5xl px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400 mt-1">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Pixel Preservation</h4>
                  <p className="text-sm text-muted-foreground">
                    Only your selected area is altered. Unmasked pixels are preserved with 100% fidelity.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400 mt-1">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Fast Cloud Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    Integrated with Cloudinary media CDN for fast asset delivery and responsive handling.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400 mt-1">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Full Creative Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Adjust brush diameter, erase, invert masks, and tweak prompts until it looks natural.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 bg-card/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Pixora AI. Modern generative fill image inpainting.</p>
          <div className="flex items-center gap-4">
            <Link href="/editor" className="hover:text-foreground transition-colors">
              Editor
            </Link>
            <span className="text-border">•</span>
            <span>Cloudinary Media Storage</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import type { UploadApiResponse, UploadedImageInfo } from "@/types/upload";

export interface UploadOptions {
  onProgress?: (progress: number) => void;
}

/**
 * Client-side service to upload an image file to the Next.js Cloudinary API route.
 */
export async function uploadImageToCloudinary(
  file: File
): Promise<UploadedImageInfo> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const json: UploadApiResponse = await res.json();

  if (!res.ok || !json.success) {
    const errorMsg =
      !json.success && json.error
        ? json.error.message
        : `Upload failed with status code ${res.status}`;
    throw new Error(errorMsg);
  }

  return json.data;
}

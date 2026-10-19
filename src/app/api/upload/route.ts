import { NextRequest, NextResponse } from "next/server";
import {
  getCloudinaryClient,
  ALLOWED_IMAGE_MIME_TYPES,
  DEFAULT_MAX_UPLOAD_MB,
} from "@/lib/cloudinary";
import type { UploadApiResponse, UploadedImageInfo } from "@/types/upload";
import type { UploadApiResponse as CloudinaryUploadResult } from "cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse<UploadApiResponse>> {
  try {
    // 1. Verify Cloudinary credentials presence
    let cloudinary;
    try {
      cloudinary = getCloudinaryClient();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cloudinary not configured";
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CONFIG_ERROR",
            message: msg,
          },
        },
        { status: 500 }
      );
    }

    // 2. Parse Multipart form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NO_FILE",
            message: "No image file provided in request. Please supply a 'file' field.",
          },
        },
        { status: 400 }
      );
    }

    // 3. Validate MIME type
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_FILE_TYPE",
            message: `Unsupported file type (${file.type}). Allowed types: JPEG, PNG, WebP, AVIF.`,
          },
        },
        { status: 400 }
      );
    }

    // 4. Validate file size
    const maxMb = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB) || DEFAULT_MAX_UPLOAD_MB;
    const maxBytes = maxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FILE_TOO_LARGE",
            message: `File size exceeds the limit of ${maxMb}MB.`,
          },
        },
        { status: 400 }
      );
    }

    // 5. Buffer conversion for streaming to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "pixora-ai/uploads";

    // 6. Upload stream to Cloudinary
    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto" }],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Unknown error during Cloudinary upload"));
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    const data: UploadedImageInfo = {
      publicId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      originalFilename: uploadResult.original_filename,
      createdAt: uploadResult.created_at,
    };

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[Cloudinary Upload Route Error]:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPLOAD_FAILED",
          message: `Failed to upload image: ${message}`,
        },
      },
      { status: 500 }
    );
  }
}

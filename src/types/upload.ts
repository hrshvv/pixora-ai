export interface UploadedImageInfo {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  originalFilename?: string;
  createdAt: string;
}

export interface UploadSuccessResponse {
  success: true;
  data: UploadedImageInfo;
}

export interface UploadErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type UploadApiResponse = UploadSuccessResponse | UploadErrorResponse;

export interface UploadFileValidationOptions {
  maxSizeMB?: number;
  allowedMimeTypes?: string[];
}

export interface CloudinaryUploadResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  publicId: string;
}

export async function uploadToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  const uploadPreset = 'student_documents';
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    'https://api.cloudinary.com/v1_1/ddws0tfqz/upload',
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload file to Cloudinary');
  }

  const data = await response.json();

  if (!data.secure_url || !data.public_id) {
    throw new Error(
      'Invalid response from Cloudinary: missing required fields'
    );
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    url: data.secure_url, // URL to show
    publicId: data.public_id, // store this in DB
  };
}

export function getFileTypeFromUrl(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  );
}

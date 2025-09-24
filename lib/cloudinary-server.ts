'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Deletes a single file from Cloudinary
 * @param publicId - The Cloudinary public_id of the file
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result; // optional: return deletion info
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}

/**
 * Deletes multiple files from Cloudinary
 * @param publicIds - Array of Cloudinary public_ids
 */
export async function deleteMultipleFromCloudinary(publicIds: string[]) {
  await Promise.all(publicIds.map((id) => deleteFromCloudinary(id)));
}

import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  UploadMetadata 
} from 'firebase/storage';
import { getStorageInstance } from '@/lib/firebase'; // Ensure you have this export in your firebase.ts

// --- CONFIG ---
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

/**
 * Generic File Uploader
 * Handles unique naming, path generation, and basic validation
 */
async function uploadFile(
  file: File, 
  folderPath: string, 
  allowedTypes: string[], 
  maxSize: number
): Promise<string> {
  const storage = getStorageInstance();
  
  // 1. Validate Type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not supported.`);
  }

  // 2. Validate Size
  if (file.size > maxSize) {
    const sizeMB = maxSize / (1024 * 1024);
    throw new Error(`File is too large. Max size is ${sizeMB}MB.`);
  }

  // 3. Generate Unique Path
  // Format: folder/timestamp_random_sanitizedname
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const fullPath = `${folderPath}/${timestamp}_${randomStr}_${sanitizedName}`;

  // 4. Create Ref & Metadata
  const storageRef = ref(storage, fullPath);
  const metadata: UploadMetadata = {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString()
    }
  };

  try {
    // 5. Upload
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // 6. Get URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Storage Upload Error:", error);
    throw new Error("Failed to upload file. Please try again.");
  }
}

/**
 * Upload an Image (for Chat or Status)
 * Path suggestions: 
 * - Chat: `conversations/{convId}`
 * - Status: `statuses/{userId}`
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  return uploadFile(file, path, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE);
}

/**
 * Upload a Video
 */
export async function uploadVideo(file: File, path: string): Promise<string> {
  return uploadFile(file, path, ALLOWED_VIDEO_TYPES, MAX_VIDEO_SIZE);
}

/**
 * Upload an Audio Voice Note
 */
export async function uploadAudio(blob: Blob, path: string): Promise<string> {
  // Convert Blob to File for consistency
  const file = new File([blob], "voice_note.webm", { type: 'audio/webm' });
  // Allow slightly larger size/types for audio if needed
  return uploadFile(
    file, 
    path, 
    ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav'], 
    20 * 1024 * 1024 // 20MB
  );
}
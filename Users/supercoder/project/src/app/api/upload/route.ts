// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadStream = (buffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'candleweb',
                transformation: [
                    { width: 1024, height: 1024, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        stream.end(buffer);
    });
};


export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
        }
        
        // Validate file
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File size exceeds 5MB. Please upload a smaller file.' }, { status: 400 });
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.' }, { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const uploadResult = await uploadStream(buffer);

        return NextResponse.json({ url: uploadResult.secure_url });

    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
    }
}

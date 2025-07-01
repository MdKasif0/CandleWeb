
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper to determine MIME type from file extension
const getMimeType = (filePath: string) => {
    const extension = path.extname(filePath).toLowerCase();
    switch (extension) {
        case '.html':
            return 'text/html; charset=utf-8';
        case '.css':
            return 'text/css; charset=utf-8';
        case '.js':
            return 'application/javascript; charset=utf-8';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.mp3':
            return 'audio/mpeg';
        case '.svg':
            return 'image/svg+xml';
        default:
            return 'application/octet-stream';
    }
};

export async function GET(
    request: Request,
    { params }: { params: { slug: string[] } }
) {
    const slug = params.slug.join('/');
    // Prevent directory traversal attacks
    const safeSlug = path.normalize(slug).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(process.cwd(), 'src', 'app', 'templates', safeSlug);

    try {
        const fileContent = await fs.readFile(filePath);
        const mimeType = getMimeType(filePath);

        return new NextResponse(fileContent, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
            },
        });
    } catch (error) {
        // File not found
        console.error(`File not found at ${filePath}`, error);
        return new NextResponse('Not Found', { status: 404 });
    }
}

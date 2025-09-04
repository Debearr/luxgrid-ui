import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const exportsRoot = path.join(process.cwd(), 'exports');
const statePath = path.join(process.cwd(), 'docs', 'exports-state.json');

function ensureDir(directoryPath: string): void {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

function updateDownloadState(platform: string, filename: string): void {
    let state: any = { downloads: {}, uploads: {} };
    if (fs.existsSync(statePath)) {
        try {
            state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        } catch {
            state = { downloads: {}, uploads: {} };
        }
    }
    if (!state.downloads[platform]) state.downloads[platform] = {};
    state.downloads[platform][filename] = { downloadedAt: new Date().toISOString() };
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
}

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform');
    const filename = searchParams.get('filename');
    const inline = searchParams.get('inline');

    if (!platform || !filename) {
        return new NextResponse('Missing platform or filename', { status: 400 });
    }

    const safeFilename = path.basename(filename);
    const filePath = path.join(exportsRoot, platform, safeFilename);
    ensureDir(path.dirname(filePath));

    if (!fs.existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);
    const headers = new Headers();
    headers.set('Content-Type', 'image/png');
    headers.set(
        'Content-Disposition',
        inline ? `inline; filename="${safeFilename}"` : `attachment; filename="${safeFilename}"`
    );

    // Tick-off automation on download
    updateDownloadState(platform, safeFilename);

    return new NextResponse(buffer, { headers });
}


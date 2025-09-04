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

function updateUploadState(platform: string, filename: string): void {
    let state: any = { downloads: {}, uploads: {} };
    if (fs.existsSync(statePath)) {
        try {
            state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        } catch {
            state = { downloads: {}, uploads: {} };
        }
    }
    if (!state.uploads[platform]) state.uploads[platform] = {};
    state.uploads[platform][filename] = { uploadedAt: new Date().toISOString() };
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
}

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const platform = String(formData.get('platform') || '');
    const filename = String(formData.get('filename') || '');
    const file = formData.get('file') as unknown as File | null;

    if (!platform || !filename || !file) {
        return NextResponse.json({ error: 'platform, filename, and file are required' }, { status: 400 });
    }

    const safeFilename = path.basename(filename);
    const platformDir = path.join(exportsRoot, platform);
    ensureDir(platformDir);

    const arrayBuffer = await (file as any).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(platformDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    updateUploadState(platform, safeFilename);

    return NextResponse.json({ ok: true, path: `/exports/${platform}/${safeFilename}` });
}


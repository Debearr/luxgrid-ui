import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

type Checklist = {
    platforms: Array<{
        id: string;
        label: string;
        required: string[];
    }>;
};

type StateFile = {
    downloads: Record<string, Record<string, { downloadedAt: string }>>;
    uploads: Record<string, Record<string, { uploadedAt: string }>>;
};

const checklistPath = path.join(process.cwd(), 'docs', 'exports-checklist.json');
const exportsRoot = path.join(process.cwd(), 'exports');
const statePath = path.join(process.cwd(), 'docs', 'exports-state.json');

function readChecklist(): Checklist {
    const raw = fs.readFileSync(checklistPath, 'utf8');
    return JSON.parse(raw);
}

function ensureDir(directoryPath: string): void {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

function readState(): StateFile {
    if (!fs.existsSync(statePath)) {
        return { downloads: {}, uploads: {} };
    }
    try {
        const raw = fs.readFileSync(statePath, 'utf8');
        const parsed = JSON.parse(raw) as StateFile;
        return {
            downloads: parsed.downloads || {},
            uploads: parsed.uploads || {},
        };
    } catch {
        return { downloads: {}, uploads: {} };
    }
}

export const runtime = 'nodejs';

export async function GET() {
    ensureDir(exportsRoot);
    const checklist = readChecklist();
    const state = readState();

    const data = checklist.platforms.map((platform) => {
        const platformDir = path.join(exportsRoot, platform.id);
        ensureDir(platformDir);

        const presentFiles = fs
            .readdirSync(platformDir)
            .filter((name) => name.toLowerCase().endsWith('.png'));

        const required = platform.required.map((filename) => {
            const filePath = path.join(platformDir, filename);
            const exists = fs.existsSync(filePath);
            const downloaded = Boolean(state.downloads?.[platform.id]?.[filename]);
            const uploaded = Boolean(state.uploads?.[platform.id]?.[filename]);
            const previewUrl = `/api/exports/download?platform=${encodeURIComponent(
                platform.id
            )}&filename=${encodeURIComponent(filename)}&inline=1`;
            const downloadUrl = `/api/exports/download?platform=${encodeURIComponent(
                platform.id
            )}&filename=${encodeURIComponent(filename)}`;
            return {
                filename,
                exists,
                downloaded,
                uploaded,
                previewUrl,
                downloadUrl,
            };
        });

        const extras = presentFiles
            .filter((name) => !platform.required.includes(name))
            .map((filename) => {
                const previewUrl = `/api/exports/download?platform=${encodeURIComponent(
                    platform.id
                )}&filename=${encodeURIComponent(filename)}&inline=1`;
                const downloadUrl = `/api/exports/download?platform=${encodeURIComponent(
                    platform.id
                )}&filename=${encodeURIComponent(filename)}`;
                const downloaded = Boolean(state.downloads?.[platform.id]?.[filename]);
                const uploaded = Boolean(state.uploads?.[platform.id]?.[filename]);
                return {
                    filename,
                    exists: true,
                    downloaded,
                    uploaded,
                    previewUrl,
                    downloadUrl,
                };
            });

        const complete = required.length > 0 && required.every((r) => r.exists);

        return {
            platformId: platform.id,
            label: platform.label,
            required,
            extras,
            complete,
        };
    });

    return NextResponse.json({ platforms: data });
}


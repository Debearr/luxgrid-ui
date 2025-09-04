"use client";

import { useEffect, useMemo, useState } from 'react';

type FileItem = {
    filename: string;
    exists: boolean;
    downloaded: boolean;
    uploaded: boolean;
    previewUrl: string;
    downloadUrl: string;
};

type PlatformBlock = {
    platformId: string;
    label: string;
    required: FileItem[];
    extras: FileItem[];
    complete: boolean;
};

export default function ExportsPage() {
    const [data, setData] = useState<PlatformBlock[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/exports/list', { cache: 'no-store' });
            if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
            const json = await res.json();
            setData(json.platforms);
        } catch (e: any) {
            setError(e?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const overallComplete = useMemo(() => {
        if (!data) return false;
        return data.every((p) => p.complete);
    }, [data]);

    const handleUpload = async (platformId: string, filename: string, file: File) => {
        const form = new FormData();
        form.append('platform', platformId);
        form.append('filename', filename);
        form.append('file', file);
        const res = await fetch('/api/exports/upload', {
            method: 'POST',
            body: form,
        });
        if (!res.ok) throw new Error('Upload failed');
        await fetchData();
    };

    const handleUploadPicker = (platformId: string, filename: string) => async (
        ev: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = ev.target.files?.[0];
        if (file) {
            await handleUpload(platformId, filename, file);
            ev.target.value = '';
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">VOAI Exports</h1>
                <button
                    className="px-3 py-2 rounded bg-black text-white hover:opacity-90"
                    onClick={fetchData}
                >
                    Refresh
                </button>
            </div>
            {loading && <div>Loading…</div>}
            {error && <div className="text-red-600">{error}</div>}
            {data && (
                <div className="space-y-8">
                    <div className="p-3 rounded border">
                        <span className="font-medium">Checklist complete:</span>{' '}
                        <span className={overallComplete ? 'text-green-700' : 'text-orange-700'}>
                            {overallComplete ? 'Yes' : 'In progress'}
                        </span>
                    </div>
                    {data.map((platform) => (
                        <section key={platform.platformId} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold">{platform.label}</h2>
                                <span
                                    className={
                                        'text-xs px-2 py-1 rounded ' +
                                        (platform.complete
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800')
                                    }
                                >
                                    {platform.complete ? 'Complete' : 'Pending'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {platform.required.map((file) => (
                                    <div key={file.filename} className="border rounded p-3 space-y-2">
                                        <div className="text-sm font-medium">{file.filename}</div>
                                        <div className="text-xs flex items-center gap-2">
                                            <span className={file.exists ? 'text-green-700' : 'text-gray-500'}>
                                                {file.exists ? 'Present' : 'Missing'}
                                            </span>
                                            <span className={file.downloaded ? 'text-blue-700' : 'text-gray-400'}>
                                                {file.downloaded ? 'Downloaded' : 'Not downloaded'}
                                            </span>
                                            <span className={file.uploaded ? 'text-purple-700' : 'text-gray-400'}>
                                                {file.uploaded ? 'Uploaded' : 'Not uploaded'}
                                            </span>
                                        </div>
                                        <div className="aspect-video bg-gray-50 border overflow-hidden flex items-center justify-center">
                                            {file.exists ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={file.previewUrl} alt={file.filename} className="object-contain max-h-48" />
                                            ) : (
                                                <div className="text-xs text-gray-400">No preview</div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={file.downloadUrl}
                                                className="px-2 py-1 text-sm rounded bg-black text-white hover:opacity-90"
                                            >
                                                Download
                                            </a>
                                            <label className="px-2 py-1 text-sm rounded border cursor-pointer hover:bg-gray-50">
                                                Upload
                                                <input
                                                    type="file"
                                                    accept="image/png"
                                                    className="hidden"
                                                    onChange={handleUploadPicker(platform.platformId, file.filename)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {platform.extras.length > 0 && (
                                <details className="mt-2">
                                    <summary className="cursor-pointer text-sm text-gray-600">Extras</summary>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                        {platform.extras.map((file) => (
                                            <div key={file.filename} className="border rounded p-3 space-y-2">
                                                <div className="text-sm font-medium">{file.filename}</div>
                                                <div className="aspect-video bg-gray-50 border overflow-hidden flex items-center justify-center">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={file.previewUrl} alt={file.filename} className="object-contain max-h-48" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={file.downloadUrl}
                                                        className="px-2 py-1 text-sm rounded bg-black text-white hover:opacity-90"
                                                    >
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}


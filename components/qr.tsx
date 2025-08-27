"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QR({ value, className }: { value: string; className?: string }) {
  const [dataUrl, setDataUrl] = useState<string>("");
  useEffect(() => {
    QRCode.toDataURL(value, { margin: 1, scale: 6 }).then(setDataUrl);
  }, [value]);
  if (!dataUrl) return null;
  return <img src={dataUrl} alt="QR code" className={className} />;
}


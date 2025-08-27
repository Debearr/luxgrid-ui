"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

interface QRProps {
  value: string
  className?: string
  size?: number
  label?: string
}

export function QR({ value, className, size = 6, label }: QRProps) {
  const [dataUrl, setDataUrl] = useState<string>("")

  useEffect(() => {
    async function generateQR() {
      try {
        const url = await QRCode.toDataURL(value, {
          margin: 1,
          scale: size,
          errorCorrectionLevel: "H"
        })
        setDataUrl(url)
      } catch (err) {
        console.error("❌ QR generation failed:", err)
        setDataUrl("")
      }
    }
    if (value) generateQR()
  }, [value, size])

  if (!dataUrl) {
    return (
      <div className="text-xs text-red-500 bg-black/70 px-2 py-1 rounded-md">
        QR not available
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        src={dataUrl}
        alt="QR code"
        className={`rounded-lg shadow-md border border-noid-teal/40 ${className ?? ""}`}
      />
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}


import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { db } from '@/lib/db/db'
import { downloadDbBackup, importDbFromFile } from '@/lib/db/backup'

export function Footer() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const onImport = async (file: File) => {
    try {
      await importDbFromFile(db, file)
      setMessage('Data berhasil dipulihkan — muat ulang halaman untuk melihatnya.')
    } catch {
      setMessage('File backup tidak valid.')
    }
  }

  return (
    <footer className="mt-2 pb-10 text-center">
      <div className="flex justify-center gap-2">
        <button
          onClick={() => void downloadDbBackup(db)}
          className="inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download className="size-3" />
          Ekspor data
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Upload className="size-3" />
          Impor data
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void onImport(f)
            e.target.value = ''
          }}
        />
      </div>
      {message && <p className="mt-3 text-xs text-muted-foreground">{message}</p>}
      <p className="mt-4 text-[11px] text-muted-foreground/70">
        JAIM — Jaga Iman · data tersimpan di perangkatmu
      </p>
    </footer>
  )
}

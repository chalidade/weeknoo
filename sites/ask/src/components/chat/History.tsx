import { useLiveQuery } from 'dexie-react-hooks'
import { Download, Plus, Trash2, X } from 'lucide-react'
import { daftarChat, db, downloadDbBackup, hapusChat } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Laci riwayat. Isinya dibaca lewat useLiveQuery, jadi daftar ini menyegarkan
 * dirinya sendiri begitu ada percakapan baru — tanpa perlu diberi tahu.
 */
export function History({
  activeId,
  onPick,
  onNew,
  onClose,
}: {
  activeId: number | null
  onPick: (id: number) => void
  onNew: () => void
  onClose: () => void
}) {
  const chats = useLiveQuery(daftarChat, [], [])

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Tutup riwayat"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
      />

      <aside className="relative flex h-full w-80 max-w-[85vw] flex-col border-r border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Riwayat</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="border-b border-border p-3">
          <Button variant="secondary" className="w-full justify-start" onClick={onNew}>
            <Plus className="size-4" />
            Percakapan baru
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.length === 0 ? (
            <p className="px-2 py-8 text-center text-xs text-muted-foreground">
              Belum ada percakapan tersimpan.
            </p>
          ) : (
            <ul className="space-y-1">
              {chats.map((chat) => (
                <li key={chat.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onPick(chat.id)}
                    className={cn(
                      'w-full rounded-lg px-3 py-2 pr-9 text-left text-sm transition-colors',
                      chat.id === activeId
                        ? 'bg-primary/15 text-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    <span className="line-clamp-2 leading-snug">{chat.title}</span>
                    <span className="mt-0.5 block text-[11px] opacity-70">
                      {new Date(chat.updatedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus percakapan ${chat.title}`}
                    onClick={() => void hapusChat(chat.id)}
                    className="absolute top-2 right-2 rounded p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={() => void downloadDbBackup(db)}
          >
            <Download className="size-4" />
            Unduh cadangan (.json)
          </Button>
          <p className="mt-1.5 px-3 text-[11px] leading-relaxed text-muted-foreground">
            Riwayat tersimpan di browser ini saja. Unduh cadangan kalau mau
            memindahkannya ke perangkat lain.
          </p>
        </div>
      </aside>
    </div>
  )
}

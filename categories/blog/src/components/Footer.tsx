export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl font-semibold tracking-tight">__SITE_NAME__</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground text-pretty">
              Majalah daring tentang teknologi dan budaya — ditulis pelan-pelan,
              dibaca dengan tenang.
            </p>
          </div>
          <nav aria-label="Rubrik">
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Rubrik
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#kategori" className="text-muted-foreground transition-colors hover:text-foreground">
                  Teknologi
                </a>
              </li>
              <li>
                <a href="#kategori" className="text-muted-foreground transition-colors hover:text-foreground">
                  Budaya
                </a>
              </li>
              <li>
                <a href="#kategori" className="text-muted-foreground transition-colors hover:text-foreground">
                  Desain
                </a>
              </li>
              <li>
                <a href="#kategori" className="text-muted-foreground transition-colors hover:text-foreground">
                  Buku
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Tautan">
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Tautan
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#beranda" className="text-muted-foreground transition-colors hover:text-foreground">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#artikel" className="text-muted-foreground transition-colors hover:text-foreground">
                  Artikel Terbaru
                </a>
              </li>
              <li>
                <a href="#newsletter" className="text-muted-foreground transition-colors hover:text-foreground">
                  Newsletter
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} __SITE_NAME__. Seluruh tulisan dilindungi hak cipta.</p>
          <p>Terbit setiap Selasa &amp; Jumat.</p>
        </div>
      </div>
    </footer>
  )
}

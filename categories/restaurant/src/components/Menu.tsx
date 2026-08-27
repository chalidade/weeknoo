import { motion } from 'motion/react'
import { Flame } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

type MenuItem = {
  name: string
  desc: string
  price: string
  favorit?: boolean
}

type MenuGroup = {
  title: string
  items: MenuItem[]
}

const MENU: MenuGroup[] = [
  {
    title: 'Hidangan Pembuka',
    items: [
      {
        name: 'Gado-Gado Siram',
        desc: 'Sayur segar, lontong, bumbu kacang tumbuk kasar',
        price: 'Rp32.000',
      },
      {
        name: 'Sate Lilit Ikan',
        desc: 'Tenggiri giling, batang serai bakar, sambal matah',
        price: 'Rp38.000',
      },
      {
        name: 'Tahu Gejrot Cirebon',
        desc: 'Tahu goreng hangat, kuah asam manis pedas',
        price: 'Rp24.000',
      },
    ],
  },
  {
    title: 'Hidangan Utama',
    items: [
      {
        name: 'Rendang Sapi Delapan Jam',
        desc: 'Daging empuk, santan kental, rempah Minang',
        price: 'Rp68.000',
        favorit: true,
      },
      {
        name: 'Gulai Kakap Kuning',
        desc: 'Kakap merah, belimbing wuluh, daun kemangi',
        price: 'Rp75.000',
      },
      {
        name: 'Ayam Betutu Kampung',
        desc: 'Ayam kampung utuh, bumbu base genep, level pedas pilihan',
        price: 'Rp58.000',
        favorit: true,
      },
      {
        name: 'Sop Buntut Bakar',
        desc: 'Buntut sapi bakar kecap, kuah bening kaldu sapi',
        price: 'Rp82.000',
      },
    ],
  },
  {
    title: 'Minuman & Penutup',
    items: [
      {
        name: 'Es Cendol Gula Aren',
        desc: 'Cendol pandan, santan segar, gula aren cair',
        price: 'Rp25.000',
      },
      {
        name: 'Klepon Cake Pandan',
        desc: 'Bolu pandan lembut, unti kelapa, gula merah',
        price: 'Rp28.000',
      },
      {
        name: 'Kopi Tubruk Aren',
        desc: 'Robusta Lampung, gula aren, disajikan panas',
        price: 'Rp22.000',
      },
    ],
  },
]

export function Menu() {
  return (
    <section id="menu" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p
          variants={fadeUp}
          className="text-sm font-medium tracking-widest text-primary uppercase"
        >
          Menu Andalan
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        >
          Disiapkan setiap pagi, dimasak sepenuh hati
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-muted-foreground">
          Semua hidangan menggunakan bahan segar dari pasar lokal dan rempah yang
          kami giling sendiri. Harga sudah termasuk nasi putih hangat.
        </motion.p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {MENU.map((group) => (
            <motion.div
              key={group.title}
              variants={fadeUp}
              className="rounded-2xl border bg-card p-6 shadow-xs sm:p-8"
            >
              <h3 className="font-display text-xl font-bold">{group.title}</h3>
              <ul className="mt-6 space-y-6">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-medium">
                        {item.name}
                        {item.favorit && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                            <Flame className="size-3 text-primary" />
                            Favorit
                          </span>
                        )}
                      </p>
                      <p className="shrink-0 font-medium text-primary">{item.price}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

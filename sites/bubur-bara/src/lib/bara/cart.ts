// The cart: a tiny external store shared by the menu, the navbar badge and
// the checkout drawer. Lines are snapshots (name + price at the time they
// were added), so the drawer never has to look the menu up again.
import { useSyncExternalStore } from 'react'
import type { MenuItem } from './data'

export type CartAddon = { id: string; name: string; price: number }

export type CartLine = {
  key: string
  itemId: string
  name: string
  /** unit price including add-ons */
  unitPrice: number
  addons: CartAddon[]
  qty: number
}

type CartState = { lines: CartLine[]; open: boolean }

let state: CartState = { lines: [], open: false }
const listeners = new Set<() => void>()

function set(next: Partial<CartState>) {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

export const cart = {
  add(item: MenuItem, addons: CartAddon[] = [], qty = 1) {
    const key = [item.id, ...addons.map((a) => a.id).sort()].join('+')
    const existing = state.lines.find((l) => l.key === key)
    if (existing) {
      cart.setQty(key, existing.qty + qty)
      return
    }
    const unitPrice = item.price + addons.reduce((s, a) => s + a.price, 0)
    set({ lines: [...state.lines, { key, itemId: item.id, name: item.name, unitPrice, addons, qty }] })
  },
  setQty(key: string, qty: number) {
    set({
      lines:
        qty <= 0
          ? state.lines.filter((l) => l.key !== key)
          : state.lines.map((l) => (l.key === key ? { ...l, qty } : l)),
    })
  },
  clear() {
    set({ lines: [] })
  },
  open() {
    set({ open: true })
  },
  close() {
    set({ open: false })
  },
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useCart() {
  const s = useSyncExternalStore(subscribe, () => state)
  const count = s.lines.reduce((n, l) => n + l.qty, 0)
  const total = s.lines.reduce((n, l) => n + l.qty * l.unitPrice, 0)
  return { ...s, count, total }
}

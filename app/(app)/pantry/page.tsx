'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PantryItem, PANTRY_CATEGORIES } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/components/providers/ProfileProvider'
import PremiumModal from '@/components/premium/PremiumModal'

export default function PantryPage() {
  const profile = useProfile()
  const router = useRouter()
  const [items, setItems] = useState<PantryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Tous')
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<PantryItem | null>(null)
  const supabase = createClient()

  const isPremium = profile?.plan === 'premium'

  useEffect(() => {
    if (!isPremium) return
    loadItems()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium])

  async function loadItems() {
    setLoading(true)
    const { data } = await supabase.from('pantry_items').select('*').order('added_at', { ascending: false })
    setItems((data as PantryItem[]) ?? [])
    setLoading(false)
  }

  async function deleteItem(id: string) {
    await supabase.from('pantry_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const now = new Date()
  const categories = ['Tous', ...PANTRY_CATEGORIES]
  const filtered = filter === 'Tous' ? items : items.filter(i => i.category === filter)
  const urgentCount = items.filter(i => {
    const days = Math.floor((now.getTime() - new Date(i.added_at).getTime()) / 86400000)
    return days >= 5
  }).length

  if (!isPremium) return <PremiumGate />

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-100 px-6 pt-8 pb-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Mon Pantry</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {items.length} ingrédient{items.length !== 1 ? 's' : ''}
              {urgentCount > 0 && <span className="text-amber-500 ml-2">· {urgentCount} à utiliser vite</span>}
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="w-10 h-10 bg-green-500 hover:bg-green-400 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm shadow-green-500/20"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        {/* Category filter */}
        <div className="max-w-lg mx-auto mt-4 -mx-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                  filter === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(n => <div key={n} className="h-16 bg-white rounded-2xl skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyPantry onAdd={() => setShowAdd(true)} />
        ) : (
          <div className="space-y-2">
            {filtered.map(item => (
              <PantryItemRow
                key={item.id}
                item={item}
                onEdit={() => setEditItem(item)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </div>
        )}
      </main>

      {(showAdd || editItem) && (
        <ItemForm
          item={editItem}
          onClose={() => { setShowAdd(false); setEditItem(null) }}
          onSave={loadItems}
        />
      )}
    </div>
  )
}

function PantryItemRow({ item, onEdit, onDelete }: { item: PantryItem; onEdit: () => void; onDelete: () => void }) {
  const days = Math.floor((new Date().getTime() - new Date(item.added_at).getTime()) / 86400000)
  const urgent = days >= 5

  return (
    <div className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm border border-gray-100 animate-fade-in">
      <div className={`w-2 h-2 rounded-full shrink-0 ${urgent ? 'bg-amber-400' : 'bg-green-400'}`} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
        <p className="text-xs text-gray-400">
          {item.quantity && <span>{item.quantity} · </span>}
          {item.category && <span>{item.category} · </span>}
          {urgent ? <span className="text-amber-500 font-medium">À utiliser bientôt</span> : <span>Ajouté il y a {days}j</span>}
        </p>
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={onEdit} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    </div>
  )
}

function ItemForm({ item, onClose, onSave }: { item: PantryItem | null; onClose: () => void; onSave: () => void }) {
  const supabase = createClient()
  const [name, setName] = useState(item?.name ?? '')
  const [quantity, setQuantity] = useState(item?.quantity ?? '')
  const [category, setCategory] = useState(item?.category ?? '')
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!name.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { onClose(); return }

    if (item) {
      await supabase.from('pantry_items').update({ name: name.trim(), quantity: quantity || null, category: category || null, updated_at: new Date().toISOString() }).eq('id', item.id)
    } else {
      await supabase.from('pantry_items').insert({ user_id: user.id, name: name.trim(), quantity: quantity || null, category: category || null })
    }
    await onSave()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[2rem] p-6 shadow-2xl animate-slide-up">
        <h3 className="font-black text-gray-900 text-lg mb-5">{item ? 'Modifier' : 'Ajouter un ingrédient'}</h3>
        <div className="space-y-3 mb-6">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom de l'ingrédient *" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 transition-colors" />
          <input value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantité (ex: 500g, 2 pièces)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 transition-colors" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 transition-colors text-gray-700">
            <option value="">Catégorie (optionnel)</option>
            {PANTRY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={save} disabled={saving || !name.trim()} className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors">
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl transition-colors">Annuler</button>
        </div>
      </div>
    </div>
  )
}

function EmptyPantry({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">📦</div>
      <h3 className="font-black text-gray-900 text-lg mb-2">Pantry vide</h3>
      <p className="text-gray-400 text-sm mb-6">Ajoutez vos ingrédients ou scannez votre frigo</p>
      <button onClick={onAdd} className="bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-xl transition-colors">+ Ajouter un ingrédient</button>
    </div>
  )
}

function PremiumGate() {
  const [show, setShow] = useState(true)
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-xl font-black text-gray-900 mb-2">Fonctionnalité Premium</h2>
      <p className="text-gray-500 text-sm mb-6">Le Pantry est disponible avec l&apos;abonnement Premium.</p>
      <button onClick={() => setShow(true)} className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-2xl transition-colors">⭐ Passer Premium</button>
      <button onClick={() => router.back()} className="mt-4 text-gray-400 text-sm hover:text-gray-600 transition-colors">← Retour</button>
      {show && <PremiumModal onClose={() => setShow(false)} />}
    </div>
  )
}

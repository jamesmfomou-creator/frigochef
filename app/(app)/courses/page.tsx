'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingItem, ShoppingList, PANTRY_CATEGORIES } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/components/providers/ProfileProvider'
import PremiumModal from '@/components/premium/PremiumModal'

export default function CoursesPage() {
  const profile = useProfile()
  const router = useRouter()
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [listId, setListId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newQty, setNewQty] = useState('')
  const [newCat, setNewCat] = useState('')
  const supabase = createClient()
  const isPremium = profile?.plan === 'premium'

  useEffect(() => {
    if (!isPremium) return
    loadList()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium])

  async function loadList() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    let { data } = await supabase.from('shopping_lists').select('*').eq('user_id', user.id).single<ShoppingList>()
    if (!data) {
      const { data: created } = await supabase.from('shopping_lists').insert({ user_id: user.id, items: [] }).select().single<ShoppingList>()
      data = created
    }
    if (data) { setListId(data.id); setItems(data.items) }
    setLoading(false)
  }

  async function saveItems(newItems: ShoppingItem[]) {
    setItems(newItems)
    if (listId) await supabase.from('shopping_lists').update({ items: newItems, updated_at: new Date().toISOString() }).eq('id', listId)
  }

  function toggle(id: string) {
    saveItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  function remove(id: string) { saveItems(items.filter(i => i.id !== id)) }

  function addItem() {
    if (!newName.trim()) return
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      quantity: newQty.trim() || '1',
      category: newCat || 'Autres',
      checked: false,
    }
    saveItems([...items, item])
    setNewName(''); setNewQty(''); setNewCat('')
  }

  function clearChecked() { saveItems(items.filter(i => !i.checked)) }

  const pending = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)
  const grouped = PANTRY_CATEGORIES.reduce((acc, cat) => {
    const catItems = pending.filter(i => i.category === cat)
    if (catItems.length > 0) acc[cat] = catItems
    return acc
  }, {} as Record<string, ShoppingItem[]>)
  const uncategorized = pending.filter(i => !PANTRY_CATEGORIES.includes(i.category))
  if (uncategorized.length > 0) grouped['Autres'] = uncategorized

  if (!isPremium) return <PremiumGate />

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-100 px-6 pt-8 pb-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Courses</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {pending.length} article{pending.length !== 1 ? 's' : ''} à acheter
              {checked.length > 0 && <span className="ml-2 text-green-500">· {checked.length} coché{checked.length > 1 ? 's' : ''}</span>}
            </p>
          </div>
          {checked.length > 0 && (
            <button onClick={clearChecked} className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">Effacer cochés</button>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5">
        {/* Add item */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ajouter un article</p>
          <div className="flex gap-2 mb-2">
            <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder="Nom de l'article *" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 transition-colors" />
            <input value={newQty} onChange={e => setNewQty(e.target.value)} placeholder="Qté" className="w-16 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 transition-colors text-center" />
          </div>
          <div className="flex gap-2">
            <select value={newCat} onChange={e => setNewCat(e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 transition-colors text-gray-600">
              <option value="">Catégorie</option>
              {PANTRY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={addItem} disabled={!newName.trim()} className="bg-green-500 hover:bg-green-400 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl transition-colors font-semibold text-sm">Ajouter</button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">{[1,2,3,4].map(n => <div key={n} className="h-14 bg-white rounded-xl skeleton" />)}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="font-black text-gray-900 text-lg mb-2">Liste vide</h3>
            <p className="text-gray-400 text-sm">Ajoutez des articles ou générez depuis votre planning</p>
          </div>
        ) : (
          <>
            {Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat} className="mb-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{cat}</p>
                <div className="space-y-2">
                  {catItems.map(item => (
                    <ShoppingItemRow key={item.id} item={item} onToggle={() => toggle(item.id)} onDelete={() => remove(item.id)} />
                  ))}
                </div>
              </div>
            ))}

            {checked.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Cochés</p>
                <div className="space-y-2 opacity-50">
                  {checked.map(item => (
                    <ShoppingItemRow key={item.id} item={item} onToggle={() => toggle(item.id)} onDelete={() => remove(item.id)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function ShoppingItemRow({ item, onToggle, onDelete }: { item: ShoppingItem; onToggle: () => void; onDelete: () => void }) {
  return (
    <div className={`bg-white rounded-xl px-4 py-3 flex items-center gap-3 border shadow-sm transition-all ${item.checked ? 'border-green-100' : 'border-gray-100'}`}>
      <button onClick={onToggle} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-green-400'}`}>
        {item.checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{item.name}</p>
        {item.quantity !== '1' && <p className="text-xs text-gray-400">{item.quantity}</p>}
      </div>
      <button onClick={onDelete} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  )
}

function PremiumGate() {
  const [show, setShow] = useState(true)
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-4">🛒</div>
      <h2 className="text-xl font-black text-gray-900 mb-2">Liste de courses intelligente</h2>
      <p className="text-gray-500 text-sm mb-6">Générée automatiquement depuis votre planning. Fonctionnalité Premium.</p>
      <button onClick={() => setShow(true)} className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-2xl transition-colors">⭐ Passer Premium</button>
      <button onClick={() => router.back()} className="mt-4 text-gray-400 text-sm hover:text-gray-600 transition-colors">← Retour</button>
      {show && <PremiumModal onClose={() => setShow(false)} />}
    </div>
  )
}

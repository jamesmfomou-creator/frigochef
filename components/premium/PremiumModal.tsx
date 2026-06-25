'use client'

const FEATURES = [
  'Scans illimités',
  'Pantry intelligent',
  'Planning automatique',
  'Liste de courses intelligente',
  'Historique complet',
  'Suggestions anti-gaspillage',
]

interface Props {
  onClose?: () => void
}

export default function PremiumModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] p-8 shadow-2xl animate-slide-up">
        {/* Close */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            ⭐
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1.5">Passez Premium</h2>
          <p className="text-gray-400 text-sm">Débloquez l&apos;assistant alimentaire complet</p>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-gray-700 text-sm">
              <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-[10px] font-bold shrink-0">
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
          onClick={() => alert('Stripe bientôt disponible 🚀')}
        >
          Débloquer Premium
          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Bientôt</span>
        </button>

        <p className="text-center text-gray-400 text-xs mt-3">
          Paiement sécurisé par Stripe
        </p>
      </div>
    </div>
  )
}

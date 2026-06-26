'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ padding: '24px', fontFamily: 'monospace', background: '#fff' }}>
        <h2 style={{ color: 'red' }}>Erreur : {error.message}</h2>
        <p>Digest : {error.digest}</p>
        <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
        <button onClick={reset}>Réessayer</button>
      </body>
    </html>
  )
}

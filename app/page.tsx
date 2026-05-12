import Link from 'next/link'

export default function Home() {
  const derbies = [
    {
      id: 'manchester',
      city: 'Manchester',
      question: 'Manchester has a colour. Red or blue?',
      colorA: '#DC2626',
      colorB: '#2563EB',
      labelA: 'Red',
      labelB: 'Blue',
    }
  ]

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(48px, 10vw, 80px)',
          letterSpacing: '0.05em',
          lineHeight: 1,
          marginBottom: '0.5rem'
        }}>
          <span style={{ color: '#DC2626' }}>RED</span>
          <span style={{ color: '#666', margin: '0 12px', fontSize: '0.6em' }}>VS</span>
          <span style={{ color: '#2563EB' }}>BLUE</span>
        </div>
        <p style={{ color: '#666', fontSize: 14 }}>
          Buy a pixel. Claim your territory. Win for your youth.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {derbies.map((derby) => (
          <Link key={derby.id} href={`/derby/${derby.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '20px 24px',
              background: '#141414',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#f0f0f0', marginBottom: 4 }}>
                🏴󠁧󠁢󠁥󠁮󠁧󠁿 {derby.city}
              </div>
              <div style={{ fontSize: 13, color: '#666', fontStyle: 'italic', marginBottom: 12 }}>
                "{derby.question}"
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{
                  flex: 1, padding: '8px', borderRadius: 6,
                  background: derby.colorA, color: '#fff',
                  fontSize: 13, fontWeight: 600, textAlign: 'center'
                }}>
                  {derby.labelA}
                </div>
                <div style={{
                  flex: 1, padding: '8px', borderRadius: 6,
                  background: derby.colorB, color: '#fff',
                  fontSize: 13, fontWeight: 600, textAlign: 'center'
                }}>
                  {derby.labelB}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{
        marginTop: '3rem', padding: '20px 24px',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, background: '#141414'
      }}>
        <div style={{ fontSize: 13, color: '#555', lineHeight: 1.8 }}>
         <p>🎯 Minimum 10 pixels = $10 to start</p>
          <p>🗺 Once a pixel is claimed, it's gone forever</p>
          <p>🏆 20% of total revenue goes to the winning colour's youth academy</p>
        </div>
      </div>
    </main>
  )
}
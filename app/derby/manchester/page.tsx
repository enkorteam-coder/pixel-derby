'use client'
console.log('페이지 로드됨')  // 이 줄 추가
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const COLS = 800
const ROWS = 640

const MANCHESTER_POLYGON: number[][] = [
  [0.028,0.463],[0.041,0.486],[0.054,0.491],[0.074,0.512],[0.080,0.515],
  [0.083,0.516],[0.084,0.516],[0.088,0.520],[0.103,0.521],[0.107,0.533],
  [0.124,0.565],[0.164,0.573],[0.165,0.596],[0.160,0.612],[0.173,0.619],
  [0.179,0.621],[0.183,0.632],[0.203,0.655],[0.207,0.655],[0.208,0.651],
  [0.212,0.632],[0.235,0.619],[0.259,0.588],[0.294,0.569],[0.306,0.581],
  [0.303,0.605],[0.309,0.635],[0.327,0.678],[0.351,0.719],[0.344,0.751],
  [0.321,0.796],[0.332,0.794],[0.340,0.796],[0.344,0.795],[0.353,0.795],
  [0.360,0.803],[0.367,0.809],[0.376,0.809],[0.385,0.816],[0.389,0.820],
  [0.394,0.823],[0.399,0.827],[0.401,0.835],[0.407,0.843],[0.415,0.851],
  [0.416,0.853],[0.419,0.856],[0.419,0.857],[0.419,0.858],[0.420,0.857],
  [0.421,0.857],[0.421,0.857],[0.422,0.857],[0.423,0.857],[0.423,0.857],
  [0.424,0.858],[0.428,0.861],[0.431,0.866],[0.444,0.876],[0.452,0.875],
  [0.462,0.864],[0.476,0.866],[0.489,0.877],[0.497,0.890],[0.507,0.892],
  [0.518,0.906],[0.525,0.915],[0.524,0.931],[0.537,0.930],[0.563,0.906],
  [0.595,0.888],[0.628,0.899],[0.657,0.922],[0.646,0.937],[0.649,0.945],
  [0.656,0.959],[0.661,0.964],[0.666,0.962],[0.668,0.962],[0.669,0.962],
  [0.671,0.961],[0.672,0.961],[0.673,0.962],[0.676,0.965],[0.677,0.966],
  [0.680,0.970],[0.683,0.971],[0.684,0.970],[0.691,0.970],[0.694,0.955],
  [0.701,0.933],[0.698,0.912],[0.707,0.886],[0.709,0.870],[0.721,0.875],
  [0.733,0.874],[0.740,0.874],[0.749,0.870],[0.752,0.870],[0.754,0.869],
  [0.760,0.871],[0.764,0.876],[0.770,0.884],[0.780,0.891],[0.785,0.891],
  [0.787,0.891],[0.789,0.891],[0.793,0.891],[0.795,0.889],[0.797,0.890],
  [0.803,0.873],[0.817,0.858],[0.832,0.857],[0.835,0.849],[0.851,0.829],
  [0.870,0.776],[0.858,0.738],[0.844,0.709],[0.842,0.691],[0.854,0.677],
  [0.860,0.673],[0.874,0.647],[0.883,0.620],[0.882,0.598],[0.885,0.562],
  [0.897,0.547],[0.900,0.522],[0.905,0.500],[0.933,0.500],[0.956,0.467],
  [0.970,0.399],[0.929,0.327],[0.888,0.280],[0.859,0.217],[0.840,0.210],
  [0.820,0.135],[0.807,0.069],[0.801,0.035],[0.787,0.046],[0.777,0.049],
  [0.767,0.067],[0.723,0.055],[0.710,0.033],[0.697,0.052],[0.664,0.151],
  [0.659,0.134],[0.645,0.122],[0.628,0.092],[0.576,0.105],[0.563,0.120],
  [0.558,0.133],[0.566,0.184],[0.561,0.213],[0.541,0.186],[0.527,0.137],
  [0.528,0.089],[0.518,0.085],[0.507,0.102],[0.460,0.098],[0.441,0.140],
  [0.442,0.167],[0.425,0.170],[0.392,0.190],[0.360,0.139],[0.351,0.166],
  [0.342,0.188],[0.341,0.200],[0.308,0.202],[0.261,0.208],[0.248,0.226],
  [0.239,0.230],[0.232,0.241],[0.222,0.258],[0.206,0.264],[0.203,0.257],
  [0.201,0.250],[0.198,0.243],[0.193,0.234],[0.183,0.226],[0.164,0.243],
  [0.158,0.262],[0.148,0.270],[0.142,0.243],[0.131,0.235],[0.112,0.243],
  [0.100,0.243],[0.088,0.241],[0.078,0.244],[0.071,0.281],[0.067,0.280],
  [0.064,0.278],[0.061,0.282],[0.060,0.283],[0.052,0.293],[0.046,0.309],
  [0.044,0.328],[0.053,0.349],[0.057,0.364],[0.052,0.384],[0.042,0.402],
]

function pointInPolygon(x: number, y: number, polygon: number[][]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1]
    const xj = polygon[j][0], yj = polygon[j][1]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

function buildMask(): Set<number> {
  const mask = new Set<number>()
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const nx = c / COLS
      const ny = r / ROWS
      if (pointInPolygon(nx, ny, MANCHESTER_POLYGON)) {
        mask.add(r * COLS + c)
      }
    }
  }
  return mask
}

const COLOR_A = '#DC2626'
const COLOR_B = '#2563EB'

export default function ManchesterPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskRef = useRef<Set<number>>(new Set())
  const gridRef = useRef<Uint8Array>(new Uint8Array(COLS * ROWS))
  const isPainting = useRef(false)
  const pendingRef = useRef<Set<number>>(new Set())
  const [selectedTeam, setSelectedTeam] = useState<'a' | 'b'>('a')
  const [brushSize, setBrushSize] = useState(4)
  const [counts, setCounts] = useState({ a: 0, b: 0 })
  const [pending, setPending] = useState(0)

  useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const orderId = params.get('token')
  const success = params.get('success')
  console.log('첫번째 useEffect - orderId:', orderId, 'success:', success)
  if (success === '1' && orderId) {
    fetch('/api/capture-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    }).then(r => r.json()).then(data => {
      console.log('Payment captured:', data)
      window.location.href = '/derby/manchester'
    })
  }
}, [])


 const drawAll = useCallback((grid: Uint8Array, mask: Set<number>) => {
    const canvas = canvasRef.current
    console.log('drawAll 실행, canvas:', canvas)  // 추가
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, COLS, ROWS)

    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 1
    for (let i = 0; i < COLS; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, ROWS); ctx.stroke()
    }
    for (let i = 0; i < ROWS; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(COLS, i); ctx.stroke()
    }

   mask.forEach(idx => {
  const r = Math.floor(idx / COLS), c = idx % COLS
  if (grid[idx] === 1) ctx.fillStyle = COLOR_A
  else if (grid[idx] === 2) ctx.fillStyle = COLOR_B
  else ctx.fillStyle = '#1e1e2a'
  ctx.fillRect(c, r, 1, 1)
})
console.log('그리기 완료, grid[52794]:', grid[52794])  // 추가

    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    const poly = MANCHESTER_POLYGON
    ctx.moveTo(poly[0][0] * COLS, poly[0][1] * ROWS)
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0] * COLS, poly[i][1] * ROWS)
    }
    ctx.closePath()
    ctx.stroke()
  }, [])

 useEffect(() => {
    console.log('useEffect 실행됨')
    const mask = buildMask()
    console.log('마스크 크기:', mask.size)
    maskRef.current = mask
    setMaskSize(mask.size)  // 추가
    const grid = gridRef.current

const loadPixels = async () => {
  console.log('loadPixels 시작')
  let allData: any[] = []
  let from = 0
  const batchSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('pixels')
      .select('pixel_index, team')
      .eq('derby_id', 'manchester')
      .range(from, from + batchSize - 1)

    if (error) {
      console.log('error:', error)
      break
    }

    if (data && data.length > 0) {
      allData = [...allData, ...data]
      if (data.length < batchSize) break
      from += batchSize
    } else {
      break
    }
  }

  console.log('전체 픽셀 수:', allData.length)

  if (allData.length > 0) {
    let a = 0, b = 0
    allData.forEach(p => {
      const idx = Number(p.pixel_index)
      if (mask.has(idx)) {
        grid[idx] = p.team === 'a' ? 1 : 2
        p.team === 'a' ? a++ : b++
      }
    })
    setCounts({ a, b })
    setTimeout(() => {
      drawAll(grid, mask)
    }, 100)
  } else {
    drawAll(grid, mask)
  }
}
    loadPixels()

    const channel = supabase
      .channel('pixels-manchester')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'pixels',
        filter: 'derby_id=eq.manchester'
      }, (payload: any) => {
        const { pixel_index, team } = payload.new
        if (grid[pixel_index] === 0) {
          grid[pixel_index] = team === 'a' ? 1 : 2
          const canvas = canvasRef.current!
          const ctx = canvas.getContext('2d')!
          ctx.fillStyle = team === 'a' ? COLOR_A : COLOR_B
          ctx.fillRect(pixel_index % COLS, Math.floor(pixel_index / COLS), 1, 1)
          setCounts((prev: any) => ({ ...prev, [team]: prev[team] + 1 }))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  function getPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      c: Math.floor((e.clientX - rect.left) * (COLS / rect.width)),
      r: Math.floor((e.clientY - rect.top) * (ROWS / rect.height))
    }
  }

  function paint(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isPainting.current) return
    const { c, r } = getPos(e)
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const grid = gridRef.current
    const color = selectedTeam === 'a' ? COLOR_A : COLOR_B
    const b = brushSize

    for (let dr = -b; dr <= b; dr++) {
      for (let dc = -b; dc <= b; dc++) {
        const nr = r + dr, nc = c + dc
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue
        const idx = nr * COLS + nc
        if (maskRef.current.has(idx) && grid[idx] === 0 && !pendingRef.current.has(idx)) {
          pendingRef.current.add(idx)
          ctx.fillStyle = color + 'bb'
          ctx.fillRect(nc, nr, 1, 1)
        }
      }
    }
    setPending(pendingRef.current.size)
  }

async function handlePurchase() {
    console.log('handlePurchase 시작', pendingRef.current.size)
    const pixels = [...pendingRef.current]
    if (pixels.length < 10) {
      alert('Minimum 10 pixels ($10) required!')
      return
    }
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          derbyId: 'manchester',
          team: selectedTeam,
          pixelIndexes: pixels,
          pixelCount: pixels.length,
        }),
      })
      const data = await res.json()
      console.log('checkout response:', data)
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error: ' + (data.error || JSON.stringify(data)))
      }
    } catch (err: any) {
      console.error('handlePurchase error:', err)
      alert('Error: ' + (err?.message || String(err)))
    }
  }
  function clearSelection() {
    pendingRef.current = new Set()
    setPending(0)
    drawAll(gridRef.current, maskRef.current)
  }

  const totalSold = counts.a + counts.b
  const [maskSize, setMaskSize] = useState(0)
  const redPct = totalSold > 0 ? Math.round(counts.a / totalSold * 100) : 50

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <Link href="/" style={{ fontSize: 13, color: '#555', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
        ← All Derbies
      </Link>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 40, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em', marginBottom: 4, color: '#f0f0f0' }}>
          Manchester
        </h1>
        <p style={{ fontSize: 15, color: '#666', fontStyle: 'italic' }}>
          "Manchester has a colour. Red or blue?"
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Raised', value: `$${totalSold}`, sub: `${maskSize.toLocaleString()} pixels available` },
          { label: 'Pixels Sold', value: totalSold.toLocaleString(), sub: `${Math.round(totalSold / maskSize * 100)}% complete` },
          { label: 'Youth Fund', value: `$${Math.round(Math.max(counts.a, counts.b) * 0.2)}`, sub: 'Winner gets this' },
        ].map(s => (
          <div key={s.label} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#f0f0f0' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[{ team: 'a' as const, label: '🔴 Red', color: COLOR_A }, { team: 'b' as const, label: '🔵 Blue', color: COLOR_B }].map(({ team, label, color }) => (
          <button key={team} onClick={() => setSelectedTeam(team)} style={{
            flex: 1, padding: '10px', borderRadius: 8, border: 'none',
            background: selectedTeam === team ? color : '#1f1f1f',
            color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14,
            outline: selectedTeam === team ? `2px solid ${color}` : '2px solid transparent'
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#666', width: 90 }}>Brush size</span>
        <input type="range" min={1} max={12} value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#999', width: 20 }}>{brushSize}</span>
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
        <canvas ref={canvasRef} width={COLS} height={ROWS}
          style={{ display: 'block', width: '100%', cursor: 'crosshair', imageRendering: 'pixelated' }}
          onMouseDown={e => { isPainting.current = true; pendingRef.current = new Set(); paint(e) }}
          onMouseMove={paint}
          onMouseUp={() => isPainting.current = false}
          onMouseLeave={() => isPainting.current = false}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', background: '#1f1f1f', marginBottom: 6 }}>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: `${redPct}%`, background: COLOR_A, transition: 'width 0.3s' }} />
            <div style={{ flex: 1, background: COLOR_B }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666' }}>
          <span style={{ color: COLOR_A }}>Red {redPct}%</span>
          <span>{totalSold.toLocaleString()} / {maskSize.toLocaleString()} sold</span>
          <span style={{ color: COLOR_B }}>{100 - redPct}% Blue</span>
        </div>
      </div>

      {pending > 0 && (
        <div style={{ padding: '14px 16px', borderRadius: 8, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0' }}>{pending} pixels = ${pending}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
              {pending < 10 ? `Need ${10 - pending} more (min $10)` : 'Ready ✓'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={clearSelection} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #333', background: 'transparent', color: '#666', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            <button onClick={handlePurchase} disabled={pending < 10} style={{
              padding: '8px 16px', borderRadius: 6, border: 'none',
              background: pending >= 10 ? (selectedTeam === 'a' ? COLOR_A : COLOR_B) : '#333',
              color: '#fff', fontWeight: 600, fontSize: 13, cursor: pending >= 10 ? 'pointer' : 'not-allowed'
            }}>Pay ${pending} →</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontSize: 12, color: '#555', lineHeight: 1.8 }}>
        <p>• Minimum purchase: 10 pixels = $10</p>
        <p>• Claimed pixels cannot be repurchased — first come, first served</p>
        <p>• 20% of total revenue donated to the winning colour's youth academy</p>
      </div>
    </main>
  )
}

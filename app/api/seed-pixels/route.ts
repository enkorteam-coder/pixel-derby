import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const COLS = 800
const ROWS = 640
const MANCHESTER_POLYGON = [
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

const BRUSH_SIZES = [
  [5, 5],   // 25픽셀
  [5, 10],  // 50픽셀
  [10, 10], // 100픽셀
  [10, 20], // 200픽셀
]

export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json()
    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pixels: { derby_id: string; pixel_index: number; team: string }[] = []

    const addBlock = (centerR: number, centerC: number, team: string) => {
      const [bRows, bCols] = BRUSH_SIZES[Math.floor(Math.random() * BRUSH_SIZES.length)]
      for (let dr = 0; dr < bRows; dr++) {
        for (let dc = 0; dc < bCols; dc++) {
          const r = centerR + dr
          const c = centerC + dc
          if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue
          if (!pointInPolygon(c / COLS, r / ROWS, MANCHESTER_POLYGON)) continue
          const idx = r * COLS + c
          if (!pixels.find(p => p.pixel_index === idx)) {
            pixels.push({ derby_id: 'manchester', pixel_index: idx, team })
          }
        }
      }
    }

    const redTarget = 4312
    const blueTarget = 3617

    // 랜덤 위치에 블록 단위로 채우기
    let attempts = 0
    while (pixels.filter(p => p.team === 'a').length < redTarget && attempts < 10000) {
      const r = Math.floor(Math.random() * ROWS)
      const c = Math.floor(Math.random() * COLS)
      if (pointInPolygon(c / COLS, r / ROWS, MANCHESTER_POLYGON)) {
        addBlock(r, c, 'a')
      }
      attempts++
    }

    attempts = 0
    while (pixels.filter(p => p.team === 'b').length < blueTarget && attempts < 10000) {
      const r = Math.floor(Math.random() * ROWS)
      const c = Math.floor(Math.random() * COLS)
      if (pointInPolygon(c / COLS, r / ROWS, MANCHESTER_POLYGON)) {
        addBlock(r, c, 'b')
      }
      attempts++
    }

    const redPixels = pixels.filter(p => p.team === 'a')
    const bluePixels = pixels.filter(p => p.team === 'b')

    // 배치 단위로 삽입
    const batchSize = 500
    for (let i = 0; i < redPixels.length; i += batchSize) {
      await supabaseAdmin.from('pixels').insert(redPixels.slice(i, i + batchSize))
    }
    for (let i = 0; i < bluePixels.length; i += batchSize) {
      await supabaseAdmin.from('pixels').insert(bluePixels.slice(i, i + batchSize))
    }

    return NextResponse.json({ success: true, red: redPixels.length, blue: bluePixels.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
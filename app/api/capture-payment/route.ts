import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const PAYPAL_API = 'https://api-m.sandbox.paypal.com'

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
  const secret = process.env.PAYPAL_SECRET!
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64')
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json()
    console.log('Capturing payment for order:', orderId)

    const accessToken = await getAccessToken()

    // 주문 정보 조회
    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    const order = await orderRes.json()
    console.log('Order details:', order.status)

    const customId = order.purchase_units?.[0]?.custom_id
    if (!customId) {
      return NextResponse.json({ error: 'No custom_id found' }, { status: 400 })
    }

    const parts = customId.split('|')
    const derbyId = parts[0]
    const team = parts[1]
    const tempOrderId = parts[2]

    // Supabase에서 임시 저장된 픽셀 인덱스 가져오기
    const { data: orderData } = await supabaseAdmin
      .from('orders')
      .select('pixel_indexes')
      .eq('id', tempOrderId)
      .single()

    const pixelIndexes: number[] = orderData?.pixel_indexes || []
    console.log('Pixel indexes from DB:', pixelIndexes.length)

    // 결제 캡처
    const captureRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    const capture = await captureRes.json()
    console.log('Capture result:', capture.status)

    if (capture.status === 'COMPLETED') {
      // 이미 구매된 픽셀 확인
      const { data: existing } = await supabaseAdmin
        .from('pixels')
        .select('pixel_index')
        .eq('derby_id', derbyId)
        .in('pixel_index', pixelIndexes)

      const takenSet = new Set<number>((existing || []).map((p: any) => p.pixel_index))
      const available = pixelIndexes.filter((idx: number) => !takenSet.has(idx))

      if (available.length > 0) {
        await supabaseAdmin
          .from('pixels')
          .insert(available.map((idx: number) => ({
            derby_id: derbyId,
            pixel_index: idx,
            team
          })))
        console.log(`✅ ${available.length} pixels saved!`)
      }

      // 주문 상태 업데이트
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid', pixel_count: available.length })
        .eq('id', tempOrderId)

      return NextResponse.json({ success: true, pixelsSaved: available.length })
    }

    return NextResponse.json({ error: 'Payment not completed', status: capture.status }, { status: 400 })

  } catch (err: any) {
    console.error('Capture error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
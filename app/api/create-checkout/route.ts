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
    const { derbyId, team, pixelIndexes, pixelCount } = await req.json()
    console.log('create-checkout 시작:', derbyId, team, pixelCount)

    if (pixelCount < 10) {
      return NextResponse.json({ error: 'Minimum 10 pixels required' }, { status: 400 })
    }

    const accessToken = await getAccessToken()
    const amount = Number(pixelCount).toFixed(2)

    // 임시 주문 ID 생성
    const tempOrderId = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`

    // Supabase에 임시 저장
    await supabaseAdmin
      .from('orders')
      .insert({
        id: tempOrderId,
        derby_id: derbyId,
        team,
        pixel_count: pixelCount,
        amount_usd: Number(amount),
        pixel_indexes: pixelIndexes,
        status: 'pending'
      })

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount,
          },
          description: `${pixelCount} pixels - ${derbyId} (${team})`,
          custom_id: `${derbyId}|${team}|${tempOrderId}`,
        }],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/derby/${derbyId}?success=1`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/derby/${derbyId}?cancelled=1`,
        }
      }),
    })

    const order = await res.json()
    console.log('PayPal full response:', JSON.stringify(order))

    const approveUrl = order.links?.find((l: any) => l.rel === 'approve')?.href

    if (approveUrl) {
      // PayPal order ID 업데이트
      await supabaseAdmin
        .from('orders')
        .update({ stripe_session_id: order.id })
        .eq('id', tempOrderId)

      return NextResponse.json({ url: approveUrl, orderId: order.id })
    } else {
      return NextResponse.json({ error: 'Failed to create order', details: order }, { status: 500 })
    }

  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
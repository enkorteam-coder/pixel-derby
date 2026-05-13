import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Paddle webhook 이벤트 처리
    if (body.event_type === 'transaction.completed') {
      const transaction = body.data
      const customData = transaction.custom_data
      
      if (!customData) return NextResponse.json({ received: true })
      
      const { derbyId, team, pixelIndexes } = customData
      const indexes: number[] = JSON.parse(pixelIndexes)
      
      // 이미 구매된 픽셀 확인
      const { data: existing } = await supabaseAdmin
        .from('pixels')
        .select('pixel_index')
        .eq('derby_id', derbyId)
        .in('pixel_index', indexes)
      
      const takenSet = new Set((existing || []).map((p: any) => p.pixel_index))
      const available = indexes.filter(idx => !takenSet.has(idx))
      
      if (available.length > 0) {
        await supabaseAdmin
          .from('pixels')
          .insert(available.map(idx => ({
            derby_id: derbyId,
            pixel_index: idx,
            team
          })))
      }

      // 주문 저장
      await supabaseAdmin
        .from('orders')
        .insert({
          derby_id: derbyId,
          team,
          pixel_count: available.length,
          amount_usd: transaction.details?.totals?.total / 100,
          stripe_session_id: transaction.id,
          status: 'paid',
          pixel_indexes: available
        })
    }
    
    return NextResponse.json({ received: true })
    
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { Environment, LogLevel, Paddle } from '@paddle/paddle-node-sdk'

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: Environment.production,
  logLevel: LogLevel.none,
})

export async function POST(req: NextRequest) {
  try {
    const { derbyId, team, pixelIndexes, pixelCount } = await req.json()

    if (pixelCount < 10) {
      return NextResponse.json({ error: 'Minimum 10 pixels required' }, { status: 400 })
    }

    const transaction = await paddle.transactions.create({
      items: [{
        priceId: process.env.PADDLE_PRICE_ID!,
        quantity: pixelCount,
      }],
      customData: {
        derbyId,
        team,
        pixelIndexes: JSON.stringify(pixelIndexes),
      },
    })

    return NextResponse.json({ transactionId: transaction.id })

  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
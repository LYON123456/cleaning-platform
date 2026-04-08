import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/payment/return?merchantTradeNo=xxx
 * ECPay ClientBackURL — 付款完成後跳回前端的中轉路由
 * 查詢訂單資訊後轉導至 /booking/success
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const merchantTradeNo = searchParams.get('merchantTradeNo')

  if (!merchantTradeNo) {
    return NextResponse.redirect(new URL('/booking', req.url))
  }

  const payment = await prisma.payment.findUnique({
    where: { merchantTradeNo },
    include: {
      booking: true,
    },
  })

  if (!payment) {
    return NextResponse.redirect(new URL('/booking', req.url))
  }

  const booking = payment.booking
  const params = new URLSearchParams({
    orderNo: booking.orderNo,
    serviceType: booking.serviceType,
    date: booking.scheduledDate.toISOString().split('T')[0],
    time: booking.startTime,
    address: `${booking.city}${booking.district}${booking.address}${booking.floor ? ` ${booking.floor}` : ''}`,
    amount: String(booking.totalPrice),
  })

  return NextResponse.redirect(new URL(`/booking/success?${params}`, req.url))
}

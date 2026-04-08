import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/payment/mock?merchantTradeNo=xxx
 * 模擬 ECPay 付款成功流程：更新付款狀態後跳轉至成功頁
 * 僅供開發／測試環境使用
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: '此端點僅供測試環境使用' }, { status: 403 })
  }

  const { searchParams } = req.nextUrl
  const merchantTradeNo = searchParams.get('merchantTradeNo')

  if (!merchantTradeNo) {
    return NextResponse.redirect(new URL('/booking', req.url))
  }

  const payment = await prisma.payment.findUnique({
    where: { merchantTradeNo },
    include: { booking: true },
  })

  if (!payment) {
    return NextResponse.redirect(new URL('/booking', req.url))
  }

  const mockTradeNo = `MOCK${Date.now()}`

  // 模擬 ECPay 付款成功，更新 DB
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'PAID',
        tradeNo: mockTradeNo,
        paidAt: new Date(),
        rawResponse: { RtnCode: '1', RtnMsg: '交易成功', TradeNo: mockTradeNo, _mock: true },
      },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        ecpayTradeNo: mockTradeNo,
        paidAt: new Date(),
      },
    }),
  ])

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

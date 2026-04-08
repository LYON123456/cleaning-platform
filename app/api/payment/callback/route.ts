import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyCallback } from '@/lib/ecpay'

/**
 * POST /api/payment/callback
 * ECPay 付款完成後的後端 callback
 * ECPay 使用 application/x-www-form-urlencoded 格式
 */
export async function POST(req: NextRequest) {
  let params: Record<string, string>
  try {
    const formData = await req.formData()
    params = Object.fromEntries(
      Array.from(formData.entries()).map(([k, v]) => [k, String(v)]),
    )
  } catch {
    return new NextResponse('0|ErrorIO', { status: 400 })
  }

  const { MerchantTradeNo, TradeNo, RtnCode, RtnMsg } = params

  if (!MerchantTradeNo) {
    return new NextResponse('0|ErrorMerchantTradeNo', { status: 400 })
  }

  // 驗證 CheckMacValue（正式環境必須驗證，模擬環境可略過）
  if (process.env.NODE_ENV === 'production' && !verifyCallback(params)) {
    return new NextResponse('0|ErrorCheckMacValue', { status: 400 })
  }

  // RtnCode === '1' 代表付款成功
  const isPaid = RtnCode === '1'

  const payment = await prisma.payment.findUnique({
    where: { merchantTradeNo: MerchantTradeNo },
    include: { booking: true },
  })

  if (!payment) {
    return new NextResponse('0|ErrorOrderNotFound', { status: 404 })
  }

  if (payment.status === 'PAID') {
    // 已處理過，直接回 OK 避免重複更新
    return new NextResponse('1|OK')
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: isPaid ? 'PAID' : 'UNPAID',
        tradeNo: TradeNo ?? null,
        paidAt: isPaid ? new Date() : null,
        rawResponse: params,
      },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        paymentStatus: isPaid ? 'PAID' : 'UNPAID',
        status: isPaid ? 'CONFIRMED' : 'PENDING',
        ecpayTradeNo: TradeNo ?? null,
        paidAt: isPaid ? new Date() : null,
      },
    }),
  ])

  // ECPay 要求回傳 "1|OK" 代表成功接收
  return new NextResponse('1|OK')
}

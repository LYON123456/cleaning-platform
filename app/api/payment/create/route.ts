import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createOrder, formatECPayDate, ECPAY_CONFIG } from '@/lib/ecpay'
import { generateOrderNo } from '@/lib/utils'
import { sendNotification } from '@/lib/notify'

const schema = z.object({
  serviceType: z.enum(['REGULAR', 'DEEP', 'MOVE_IN_OUT', 'OFFICE']),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式應為 YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, '時間格式應為 HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, '時間格式應為 HH:MM'),
  durationHours: z.number().positive(),
  address: z.string().min(1, '地址必填'),
  district: z.string().min(1, '行政區必填'),
  floor: z.string().optional(),
  note: z.string().optional(),
  customerName: z.string().min(1, '姓名必填'),
  customerEmail: z.string().email('Email 格式不正確'),
  customerPhone: z.string().min(8, '電話格式不正確'),
  basePrice: z.number().int().positive(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '請求格式錯誤' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '資料驗證失敗', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data

  // 查找或建立顧客帳號（guest user）
  let user = await prisma.user.findUnique({ where: { email: data.customerEmail } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
        role: 'CUSTOMER',
      },
    })
  }

  const merchantTradeNo = generateOrderNo()

  // 建立預約與付款記錄
  const booking = await prisma.booking.create({
    data: {
      orderNo: merchantTradeNo,
      customerId: user.id,
      serviceType: data.serviceType,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      address: data.address,
      district: data.district,
      city: '台北市',
      floor: data.floor,
      note: data.note,
      scheduledDate: new Date(data.scheduledDate),
      startTime: data.startTime,
      endTime: data.endTime,
      durationHours: data.durationHours,
      basePrice: data.basePrice,
      totalPrice: data.basePrice,
      payment: {
        create: {
          amount: data.basePrice,
          status: 'UNPAID',
          merchantTradeNo,
        },
      },
    },
  })

  const service = await prisma.service.findUnique({ where: { type: data.serviceType } })
  await sendNotification(
    `🔔 新預約通知\n訂單：${merchantTradeNo}\n服務：${service?.name ?? data.serviceType}\n時間：${data.scheduledDate} ${data.startTime}\n金額：NT$${data.basePrice}`,
  )

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  const orderParams = createOrder({
    merchantTradeNo,
    merchantTradeDate: formatECPayDate(),
    totalAmount: data.basePrice,
    tradeDesc: '居家清潔服務',
    itemName: data.serviceType,
    returnURL: `${baseUrl}/api/payment/callback`,
    clientBackURL: `${baseUrl}/api/payment/return?merchantTradeNo=${merchantTradeNo}`,
  })

  // 模擬模式：回傳 mock URL；正式模式：回傳 ECPay 正式閘道
  const paymentUrl = ECPAY_CONFIG.isTest
    ? `${baseUrl}/api/payment/mock?merchantTradeNo=${merchantTradeNo}`
    : ECPAY_CONFIG.paymentUrl

  return NextResponse.json(
    {
      bookingId: booking.id,
      orderNo: merchantTradeNo,
      paymentUrl,
      // 正式環境需以 form POST 方式提交給 ECPay，以下提供完整參數
      orderParams: ECPAY_CONFIG.isTest ? undefined : orderParams,
    },
    { status: 201 },
  )
}

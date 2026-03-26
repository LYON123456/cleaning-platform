import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateOrderNo } from '@/lib/utils'

const createBookingSchema = z.object({
  serviceType: z.enum(['REGULAR', 'DEEP', 'MOVE_IN_OUT', 'OFFICE']),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式應為 YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, '時間格式應為 HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, '時間格式應為 HH:MM'),
  durationHours: z.number().positive(),
  address: z.string().min(1),
  district: z.string().min(1),
  city: z.string().default('台北市'),
  floor: z.string().optional(),
  note: z.string().optional(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  basePrice: z.number().int().positive(),
  cleanerId: z.string().optional(),
})

/** GET /api/bookings — 查詢預約列表（可依 cleanerId 篩選） */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cleanerId = searchParams.get('cleanerId')

  const bookings = await prisma.booking.findMany({
    where: cleanerId ? { cleanerId } : undefined,
    orderBy: { scheduledDate: 'desc' },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      cleaner: { include: { user: { select: { id: true, name: true } } } },
      service: true,
    },
  })

  return NextResponse.json(bookings)
}

/** POST /api/bookings — 新增預約 */
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '請求格式錯誤' }, { status: 400 })
  }

  const parsed = createBookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '資料驗證失敗', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data

  // 確認師傅存在（若有指定）
  if (data.cleanerId) {
    const cleaner = await prisma.cleaner.findUnique({ where: { id: data.cleanerId } })
    if (!cleaner) {
      return NextResponse.json({ error: '指定師傅不存在' }, { status: 404 })
    }
  }

  // 查找或建立顧客
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

  const booking = await prisma.booking.create({
    data: {
      orderNo: generateOrderNo(),
      customerId: user.id,
      cleanerId: data.cleanerId ?? null,
      serviceType: data.serviceType,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      address: data.address,
      district: data.district,
      city: data.city,
      floor: data.floor,
      note: data.note,
      scheduledDate: new Date(data.scheduledDate),
      startTime: data.startTime,
      endTime: data.endTime,
      durationHours: data.durationHours,
      basePrice: data.basePrice,
      totalPrice: data.basePrice,
    },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      cleaner: { include: { user: { select: { name: true } } } },
    },
  })

  return NextResponse.json(booking, { status: 201 })
}

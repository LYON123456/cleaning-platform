import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendNotification } from '@/lib/notify'

const bookingInclude = {
  customer: { select: { id: true, name: true, email: true, phone: true } },
  cleaner: {
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  },
  service: true,
  payment: true,
} as const

/** GET /api/bookings/[id] — 查詢單筆預約 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: bookingInclude,
  })

  if (!booking) {
    return NextResponse.json({ error: '預約不存在' }, { status: 404 })
  }

  return NextResponse.json(booking)
}

const patchSchema = z.object({
  status: z
    .enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .optional(),
  cleanerId: z.string().nullable().optional(),
  extraHours: z.number().min(0).optional(),
  note: z.string().optional(),
})

/** PATCH /api/bookings/[id] — 更新預約（管理員調整時數、狀態、指派師傅） */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '請求格式錯誤' }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '資料驗證失敗', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data

  const existing = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { service: true },
  })
  if (!existing) {
    return NextResponse.json({ error: '預約不存在' }, { status: 404 })
  }

  // 計算超時費用
  let extraPrice = existing.extraPrice
  let totalPrice = existing.totalPrice
  if (data.extraHours !== undefined) {
    const extraHourRate = existing.service?.extraHourRate ?? 500
    extraPrice = Math.round(data.extraHours * extraHourRate)
    totalPrice = existing.basePrice + extraPrice
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.cleanerId !== undefined && { cleanerId: data.cleanerId }),
      ...(data.note !== undefined && { note: data.note }),
      ...(data.extraHours !== undefined && {
        extraHours: data.extraHours,
        extraPrice,
        totalPrice,
      }),
    },
    include: bookingInclude,
  })

  if (data.status === 'CONFIRMED') {
    await sendNotification(`✅ 師傅已確認接案 - 訂單 ${updated.orderNo}`)
  } else if (data.status === 'IN_PROGRESS') {
    const cleanerName = updated.cleaner?.user.name ?? '師傅'
    await sendNotification(`🚀 服務已開始 - ${cleanerName} 已到達`)
  } else if (data.status === 'COMPLETED') {
    await sendNotification(`🎉 服務完成！訂單 ${updated.orderNo}，請為師傅評分`)
  }

  return NextResponse.json(updated)
}

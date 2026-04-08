import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

/** GET /api/schedules — 查詢師傅可用時段 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const date = searchParams.get('date') // "YYYY-MM-DD"
  const cleanerId = searchParams.get('cleanerId')
  const district = searchParams.get('district')

  // 建立篩選條件
  const where: {
    isBooked?: boolean
    date?: { gte: Date; lte: Date }
    cleanerId?: string
    cleaner?: { serviceArea?: { has: string }; isActive?: boolean; isVerified?: boolean }
  } = { isBooked: false }

  if (date) {
    const targetDate = new Date(date)
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ error: '日期格式不正確' }, { status: 400 })
    }
    const nextDay = new Date(targetDate)
    nextDay.setDate(nextDay.getDate() + 1)
    where.date = { gte: targetDate, lte: nextDay }
  }

  if (cleanerId) {
    where.cleanerId = cleanerId
  }

  if (district) {
    where.cleaner = {
      serviceArea: { has: district },
      isActive: true,
      isVerified: true,
    }
  }

  const slots = await prisma.cleanerAvailability.findMany({
    where,
    include: {
      cleaner: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })

  return NextResponse.json(slots)
}

const createScheduleSchema = z.object({
  cleanerId: z.string().min(1, '師傅 ID 必填'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式應為 YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, '時間格式應為 HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, '時間格式應為 HH:MM'),
})

/** POST /api/schedules — 師傅新增可接案時間 */
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '請求格式錯誤' }, { status: 400 })
  }

  const parsed = createScheduleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: '資料驗證失敗', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data

  // 確認師傅存在
  const cleaner = await prisma.cleaner.findUnique({ where: { id: data.cleanerId } })
  if (!cleaner) {
    return NextResponse.json({ error: '師傅不存在' }, { status: 404 })
  }

  // 確認時間邏輯
  if (data.startTime >= data.endTime) {
    return NextResponse.json({ error: '結束時間必須晚於開始時間' }, { status: 400 })
  }

  const targetDate = new Date(data.date)
  if (isNaN(targetDate.getTime())) {
    return NextResponse.json({ error: '日期格式不正確' }, { status: 400 })
  }

  // 避免重複新增（unique constraint: cleanerId + date + startTime）
  const existing = await prisma.cleanerAvailability.findUnique({
    where: {
      cleanerId_date_startTime: {
        cleanerId: data.cleanerId,
        date: targetDate,
        startTime: data.startTime,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: '該時段已存在' }, { status: 409 })
  }

  const slot = await prisma.cleanerAvailability.create({
    data: {
      cleanerId: data.cleanerId,
      date: targetDate,
      startTime: data.startTime,
      endTime: data.endTime,
      isBooked: false,
    },
    include: {
      cleaner: { include: { user: { select: { name: true } } } },
    },
  })

  return NextResponse.json(slot, { status: 201 })
}

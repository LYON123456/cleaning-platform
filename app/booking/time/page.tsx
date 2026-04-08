'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookingSteps } from '@/components/booking/BookingSteps'
import { SERVICES, type ServiceType } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { format, addDays, startOfDay, isBefore } from 'date-fns'
import { zhTW } from 'date-fns/locale'

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

// Mock unavailable slots
const UNAVAILABLE: Record<string, string[]> = {
  [format(addDays(new Date(), 1), 'yyyy-MM-dd')]: ['09:00', '14:00'],
  [format(addDays(new Date(), 2), 'yyyy-MM-dd')]: ['10:00', '11:00', '15:00'],
}

function TimePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service') as ServiceType

  const service = SERVICES.find((s) => s.id === serviceId)

  const today = startOfDay(new Date())
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i + 1 + weekOffset * 7))

  const getEndTime = (startTime: string): string => {
    const [h, m] = startTime.split(':').map(Number)
    const endH = h + (service?.durationHours ?? 2)
    return `${String(Math.floor(endH)).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  const isUnavailable = (date: string, time: string) =>
    UNAVAILABLE[date]?.includes(time) ?? false

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return
    const params = new URLSearchParams({
      service: serviceId,
      date: selectedDate,
      time: selectedTime,
    })
    router.push(`/booking/address?${params}`)
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>找不到服務項目，<Link href="/booking" className="text-teal-600 underline">請重新選擇</Link></p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/booking" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span className="font-bold text-teal-700">潔淨家 CleanHome</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <BookingSteps currentStep={2} />

        <div className="mt-6">
          {/* Selected service summary */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">{service.icon}</span>
            <div>
              <div className="font-medium text-teal-900">{service.name}</div>
              <div className="text-sm text-teal-700">
                {service.durationHours} 小時・{formatPrice(service.basePrice)} 起
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">選擇服務時間</h1>
          <p className="text-gray-500 mb-6">請選擇服務日期與開始時段</p>

          {/* Date selector */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">選擇日期</h3>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    disabled={weekOffset === 0}
                    onClick={() => setWeekOffset((w) => w - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    disabled={weekOffset >= 3}
                    onClick={() => setWeekOffset((w) => w + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd')
                  const isSelected = selectedDate === dateStr
                  const isPast = isBefore(day, today)
                  return (
                    <button
                      key={dateStr}
                      disabled={isPast}
                      onClick={() => {
                        setSelectedDate(dateStr)
                        setSelectedTime(null)
                      }}
                      className={`flex flex-col items-center p-2 rounded-lg text-xs transition-colors ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : isPast
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'hover:bg-teal-50 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">
                        {format(day, 'EEE', { locale: zhTW })}
                      </span>
                      <span className={`text-base font-bold mt-0.5 ${isSelected ? 'text-white' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      <span className={`mt-0.5 ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>
                        {format(day, 'M/d')}
                      </span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Time slots */}
          {selectedDate && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-700 mb-4">
                  選擇開始時段
                  <span className="ml-2 text-sm text-gray-400">
                    （服務時長 {service.durationHours} 小時）
                  </span>
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => {
                    const unavailable = isUnavailable(selectedDate, time)
                    const isSelected = selectedTime === time
                    const endTime = getEndTime(time)
                    return (
                      <button
                        key={time}
                        disabled={unavailable}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-2 rounded-lg text-sm border transition-all ${
                          isSelected
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : unavailable
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                            : 'border-gray-200 hover:border-teal-400 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">{time}</span>
                        </div>
                        <div className={`text-xs mt-0.5 ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>
                          至 {endTime}
                        </div>
                        {unavailable && <div className="text-xs text-gray-300">已約滿</div>}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/booking">上一步</Link>
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedDate || !selectedTime}
              className="bg-teal-600 hover:bg-teal-700 px-8"
              size="lg"
            >
              下一步：填寫地址
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TimePage() {
  return (
    <Suspense>
      <TimePageContent />
    </Suspense>
  )
}

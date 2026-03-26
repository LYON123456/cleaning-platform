'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BottomNav } from '@/components/cleaner/BottomNav'
import { useToast } from '@/components/ui/use-toast'
import { addDays, format, startOfDay } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { Calendar, LayoutDashboard, LogOut, CheckCircle, XCircle, Save } from 'lucide-react'

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
]

type DaySchedule = {
  enabled: boolean
  slots: string[]
}

type Schedule = Record<string, DaySchedule>

const today = startOfDay(new Date())
const NEXT_14_DAYS = Array.from({ length: 14 }, (_, i) => addDays(today, i + 1))

// Mock initial schedule
const initSchedule = (): Schedule => {
  const s: Schedule = {}
  NEXT_14_DAYS.forEach((day) => {
    const key = format(day, 'yyyy-MM-dd')
    const dayOfWeek = day.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    s[key] = {
      enabled: !isWeekend,
      slots: isWeekend ? [] : ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
    }
  })
  return s
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<Schedule>(initSchedule())
  const [selectedDate, setSelectedDate] = useState<string>(format(NEXT_14_DAYS[0], 'yyyy-MM-dd'))
  const [saved, setSaved] = useState(false)
  const { toast } = useToast()

  const toggleDayEnabled = (date: string) => {
    setSchedule((s) => ({
      ...s,
      [date]: {
        ...s[date],
        enabled: !s[date].enabled,
        slots: !s[date].enabled ? ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'] : [],
      },
    }))
  }

  const toggleSlot = (date: string, slot: string) => {
    setSchedule((s) => {
      const current = s[date].slots
      const next = current.includes(slot) ? current.filter((t) => t !== slot) : [...current, slot]
      return { ...s, [date]: { ...s[date], slots: next } }
    })
  }

  const handleSave = () => {
    // In production: POST /api/cleaner/availability
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    toast({ title: '排班已儲存', description: '您的排班設定已成功更新', variant: 'success' })
  }

  const selectedDaySchedule = schedule[selectedDate]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-screen bg-white border-r hidden md:flex flex-col">
          <div className="p-5 border-b">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🏠</span>
              <span className="font-bold text-teal-700 text-sm">潔淨家 CleanHome</span>
            </Link>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
                王
              </div>
              <div>
                <div className="text-sm font-medium">王小明</div>
                <div className="text-xs text-gray-400">清潔師傅</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            <Link
              href="/cleaner/dashboard"
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 text-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              預約清單
            </Link>
            <Link
              href="/cleaner/schedule"
              className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-teal-50 text-teal-700 text-sm font-medium"
            >
              <Calendar className="h-4 w-4" />
              排班設定
            </Link>
          </nav>
          <div className="p-3 border-t">
            <button className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gray-500 hover:text-red-500 rounded-md hover:bg-red-50">
              <LogOut className="h-4 w-4" />
              登出
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">排班設定</h1>
            <Button
              onClick={handleSave}
              className={saved ? 'bg-green-600 hover:bg-green-700' : 'bg-teal-600 hover:bg-teal-700'}
            >
              {saved ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> 已儲存
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> 儲存設定
                </span>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Date list */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">未來 14 天</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-1">
                  {NEXT_14_DAYS.map((day) => {
                    const key = format(day, 'yyyy-MM-dd')
                    const daySchedule = schedule[key]
                    const isSelected = selectedDate === key
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedDate(key)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isSelected
                            ? 'bg-teal-600 text-white'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isSelected ? 'text-white' : ''}`}>
                            {format(day, 'M/d')}
                          </span>
                          <span className={`text-xs ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>
                            {format(day, 'EEE', { locale: zhTW })}
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${isSelected ? 'text-teal-100' : ''}`}>
                          {daySchedule.enabled ? (
                            <>
                              <CheckCircle className={`h-3.5 w-3.5 ${isSelected ? 'text-teal-100' : 'text-green-500'}`} />
                              <span>{daySchedule.slots.length} 時段</span>
                            </>
                          ) : (
                            <>
                              <XCircle className={`h-3.5 w-3.5 ${isSelected ? 'text-teal-100' : 'text-gray-300'}`} />
                              <span className={isSelected ? 'text-teal-100' : 'text-gray-400'}>休息</span>
                            </>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Slot picker */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {format(new Date(selectedDate + 'T00:00:00'), 'M月d日 (EEE)', { locale: zhTW })}
                    &nbsp;可接案時段
                  </CardTitle>
                  <button
                    onClick={() => toggleDayEnabled(selectedDate)}
                    className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      selectedDaySchedule.enabled
                        ? 'border-red-300 text-red-500 hover:bg-red-50'
                        : 'border-green-400 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {selectedDaySchedule.enabled ? '設為休息日' : '設為上班日'}
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {!selectedDaySchedule.enabled ? (
                  <div className="text-center py-12 text-gray-400">
                    <XCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>此日設定為休息日</p>
                    <p className="text-xs mt-1">點擊右上角「設為上班日」開啟</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mb-4">
                      點擊選擇您可接案的時段（每格代表 1 小時起始時間）
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isActive = selectedDaySchedule.slots.includes(slot)
                        return (
                          <button
                            key={slot}
                            onClick={() => toggleSlot(selectedDate, slot)}
                            className={`py-3 rounded-lg text-sm border transition-all ${
                              isActive
                                ? 'bg-teal-600 border-teal-600 text-white'
                                : 'border-gray-200 text-gray-600 hover:border-teal-300'
                            }`}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                    <Separator className="my-4" />
                    <div className="text-sm text-gray-500">
                      已選擇 <strong className="text-teal-600">{selectedDaySchedule.slots.length}</strong> 個時段
                      ：{selectedDaySchedule.slots.sort().join('、')}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

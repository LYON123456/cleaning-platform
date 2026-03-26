'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { BottomNav } from '@/components/cleaner/BottomNav'
import { useToast } from '@/components/ui/use-toast'
import { STATUS_LABELS, STATUS_COLORS, type BookingStatus } from '@/types'
import { formatPrice } from '@/lib/utils'
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Star,
  TrendingUp,
  CalendarCheck,
} from 'lucide-react'

// Mock data
const MOCK_BOOKINGS = [
  {
    id: '1',
    orderNo: 'CL1A2B3C4D',
    status: 'CONFIRMED' as BookingStatus,
    serviceName: '深度清潔',
    serviceIcon: '✨',
    scheduledDate: '2026-03-27',
    startTime: '09:00',
    endTime: '13:00',
    durationHours: 4,
    address: '台北市大安區忠孝東路四段100號 5樓',
    customerName: '陳小姐',
    customerPhone: '0912-345-678',
    totalPrice: 2800,
    note: '有養貓，請注意',
  },
  {
    id: '2',
    orderNo: 'CL2E3F4G5H',
    status: 'PENDING' as BookingStatus,
    serviceName: '一般清潔',
    serviceIcon: '🧹',
    scheduledDate: '2026-03-28',
    startTime: '13:00',
    endTime: '15:00',
    durationHours: 2,
    address: '台北市信義區松仁路100號',
    customerName: '林先生',
    customerPhone: '0923-456-789',
    totalPrice: 1200,
    note: '',
  },
  {
    id: '3',
    orderNo: 'CL3I4J5K6L',
    status: 'COMPLETED' as BookingStatus,
    serviceName: '搬家清潔',
    serviceIcon: '🏠',
    scheduledDate: '2026-03-20',
    startTime: '09:00',
    endTime: '15:00',
    durationHours: 6,
    address: '台北市中山區民生東路二段50號',
    customerName: '王先生',
    customerPhone: '0934-567-890',
    totalPrice: 4500,
    note: '',
  },
  {
    id: '4',
    orderNo: 'CL4M5N6O7P',
    status: 'IN_PROGRESS' as BookingStatus,
    serviceName: '辦公室清潔',
    serviceIcon: '🏢',
    scheduledDate: '2026-03-26',
    startTime: '08:00',
    endTime: '11:00',
    durationHours: 3,
    address: '台北市松山區南京東路三段200號 8樓',
    customerName: '張小姐',
    customerPhone: '0945-678-901',
    totalPrice: 2000,
    note: '門禁需聯繫管理室',
  },
]

const STATS = [
  { label: '本月完成', value: '12', icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
  { label: '本月收入', value: 'NT$28,400', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: '累計評分', value: '4.9', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { label: '待處理', value: '2', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
]

type FilterStatus = 'ALL' | BookingStatus

export default function CleanerDashboardPage() {
  const [filter, setFilter] = useState<FilterStatus>('ALL')
  const { toast } = useToast()

  const filtered = MOCK_BOOKINGS.filter((b) => filter === 'ALL' || b.status === filter)

  const filterOptions: Array<{ value: FilterStatus; label: string }> = [
    { value: 'ALL', label: '全部' },
    { value: 'PENDING', label: '待確認' },
    { value: 'CONFIRMED', label: '已確認' },
    { value: 'IN_PROGRESS', label: '進行中' },
    { value: 'COMPLETED', label: '已完成' },
  ]

  const handleAcceptJob = () => {
    toast({ title: '接案成功', description: '訂單已確認，請準時前往服務', variant: 'success' })
  }

  const handleCompleteJob = () => {
    toast({ title: '服務完成', description: '已標記此訂單為完成，感謝您的服務！', variant: 'success' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar + Main Layout */}
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
              className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-teal-50 text-teal-700 text-sm font-medium"
            >
              <LayoutDashboard className="h-4 w-4" />
              預約清單
            </Link>
            <Link
              href="/cleaner/schedule"
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 text-sm"
            >
              <Calendar className="h-4 w-4" />
              排班設定
            </Link>
          </nav>

          <div className="p-3 border-t">
            <button className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gray-500 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors">
              <LogOut className="h-4 w-4" />
              登出
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 pb-20 md:pb-6">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <Link href="/" className="flex items-center gap-1">
              <span>🏠</span>
              <span className="font-bold text-teal-700">潔淨家</span>
            </Link>
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/cleaner/schedule"><Calendar className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">我的預約</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === opt.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border text-gray-600 hover:border-teal-300'
                }`}
              >
                {opt.label}
                {opt.value !== 'ALL' && (
                  <span className="ml-1 text-xs">
                    ({MOCK_BOOKINGS.filter((b) => b.status === opt.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bookings list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <EmptyState
                icon="📭"
                title="目前沒有符合條件的預約"
                description="請調整篩選條件或等待新訂單"
              />
            ) : (
              filtered.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{booking.serviceIcon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{booking.serviceName}</div>
                          <div className="text-xs text-gray-400 font-mono">{booking.orderNo}</div>
                        </div>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <Separator className="my-3" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {booking.scheduledDate}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {booking.startTime}–{booking.endTime}（{booking.durationHours}小時）
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        {booking.address}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {booking.customerName} · {booking.customerPhone}
                      </div>
                    </div>

                    {booking.note && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800 mb-3">
                        📝 {booking.note}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-teal-600">
                        {formatPrice(booking.totalPrice)}
                      </span>
                      {booking.status === 'CONFIRMED' && (
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={handleAcceptJob}>
                          開始服務
                        </Button>
                      )}
                      {booking.status === 'IN_PROGRESS' && (
                        <Button size="sm" variant="outline" className="border-green-400 text-green-600 hover:bg-green-50" onClick={handleCompleteJob}>
                          完成服務
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/use-toast'
import { STATUS_LABELS, STATUS_COLORS, type BookingStatus } from '@/types'
import { formatPrice } from '@/lib/utils'
import {
  Search,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react'

const ALL_BOOKINGS = [
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
    address: '台北市大安區忠孝東路四段100號',
    customerName: '陳小姐',
    customerPhone: '0912-345-678',
    cleanerName: '王小明',
    totalPrice: 2800,
    paymentStatus: 'PAID',
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
    cleanerName: '未分配',
    totalPrice: 1200,
    paymentStatus: 'PAID',
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
    cleanerName: '李美玲',
    totalPrice: 4500,
    paymentStatus: 'PAID',
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
    address: '台北市松山區南京東路三段200號',
    customerName: '張小姐',
    customerPhone: '0945-678-901',
    cleanerName: '陳大偉',
    totalPrice: 2000,
    paymentStatus: 'PAID',
  },
  {
    id: '5',
    orderNo: 'CL5Q6R7S8T',
    status: 'CANCELLED' as BookingStatus,
    serviceName: '一般清潔',
    serviceIcon: '🧹',
    scheduledDate: '2026-03-22',
    startTime: '10:00',
    endTime: '12:00',
    durationHours: 2,
    address: '台北市文山區木柵路一段10號',
    customerName: '吳先生',
    customerPhone: '0956-789-012',
    cleanerName: '未分配',
    totalPrice: 1200,
    paymentStatus: 'REFUNDED',
  },
]

const STATS = [
  { label: '本月預約', value: '48', sub: '+12% vs 上月', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: '本月營收', value: 'NT$125,600', sub: '+8% vs 上月', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  { label: '活躍師傅', value: '12', sub: '3 人今日出勤', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: '完成率', value: '94%', sub: '目標 90%', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
]

export default function AdminDashboardPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const { toast } = useToast()

  const filtered = ALL_BOOKINGS.filter((b) => {
    const matchSearch =
      !search ||
      b.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.includes(search) ||
      b.cleanerName.includes(search)
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 min-h-screen bg-gray-900 text-gray-300 hidden md:flex flex-col">
          <div className="p-5 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-400" />
              <span className="font-bold text-white">管理後台</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">潔淨家 CleanHome</p>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-gray-800 text-white text-sm font-medium"
            >
              <LayoutDashboard className="h-4 w-4 text-teal-400" />
              所有預約
            </Link>
          </nav>

          <div className="p-3 border-t border-gray-700">
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-teal-700 flex items-center justify-center text-xs text-white font-bold">
                管
              </div>
              <div>
                <div className="text-sm text-white">系統管理員</div>
                <div className="text-xs text-gray-500">admin@demo.com</div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gray-500 hover:text-red-400 rounded-md hover:bg-gray-800">
              <LogOut className="h-4 w-4" />
              登出
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">預約管理</h1>

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
                  <div className="text-xs text-green-600 mt-1">{s.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜尋訂單、客戶、師傅..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部狀態</SelectItem>
                <SelectItem value="PENDING">待確認</SelectItem>
                <SelectItem value="CONFIRMED">已確認</SelectItem>
                <SelectItem value="IN_PROGRESS">進行中</SelectItem>
                <SelectItem value="COMPLETED">已完成</SelectItem>
                <SelectItem value="CANCELLED">已取消</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">訂單</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">服務</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">日期時間</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">客戶</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">師傅</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">狀態</th>
                      <th className="text-right px-4 py-3 text-gray-500 font-medium">金額</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-mono text-xs text-gray-500">{booking.orderNo}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span>{booking.serviceIcon}</span>
                            <span className="font-medium">{booking.serviceName}</span>
                          </div>
                          <div className="text-xs text-gray-400">{booking.durationHours}小時</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div>{booking.scheduledDate}</div>
                          <div className="text-xs text-gray-400">{booking.startTime}–{booking.endTime}</div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div>{booking.customerName}</div>
                          <div className="text-xs text-gray-400">{booking.customerPhone}</div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className={booking.cleanerName === '未分配' ? 'text-orange-500' : ''}>
                            {booking.cleanerName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatPrice(booking.totalPrice)}
                        </td>
                        <td className="px-4 py-3">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/bookings/${booking.id}`}>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <EmptyState
                    icon="🔍"
                    title="沒有符合條件的預約"
                    description="請調整搜尋條件或篩選器"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

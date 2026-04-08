export type ServiceType = 'REGULAR' | 'DEEP' | 'MOVE_IN_OUT' | 'OFFICE'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED'

export interface Service {
  id: ServiceType
  name: string
  description: string
  durationHours: number
  basePrice: number
  icon: string
  features: string[]
}

export interface TimeSlot {
  time: string
  label: string
  available: boolean
}

export interface BookingFormData {
  serviceType: ServiceType
  scheduledDate: string
  startTime: string
  address: string
  district: string
  city: string
  floor?: string
  note?: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

export interface BookingSummary {
  service: Service
  scheduledDate: string
  startTime: string
  endTime: string
  address: string
  totalPrice: number
}

export const SERVICES: Service[] = [
  {
    id: 'REGULAR',
    name: '一般清潔',
    description: '適合日常維護，包含除塵、拖地、浴室廚房清潔',
    durationHours: 2,
    basePrice: 1200,
    icon: '🧹',
    features: ['除塵撢灰', '拖地吸塵', '浴室清潔', '廚房檯面'],
  },
  {
    id: 'DEEP',
    name: '深度清潔',
    description: '全面深層清潔，適合換季或長期未清潔',
    durationHours: 4,
    basePrice: 2800,
    icon: '✨',
    features: ['一般清潔全部', '冰箱內部', '微波爐', '窗框軌道', '床底清潔'],
  },
  {
    id: 'MOVE_IN_OUT',
    name: '搬家清潔',
    description: '搬入新居或搬出時的全屋深度清潔',
    durationHours: 6,
    basePrice: 4500,
    icon: '🏠',
    features: ['深度清潔全部', '油煙機清潔', '全屋消毒', '廢棄物清除', '門窗擦拭'],
  },
  {
    id: 'OFFICE',
    name: '辦公室清潔',
    description: '辦公空間清潔，維持良好工作環境',
    durationHours: 3,
    basePrice: 2000,
    icon: '🏢',
    features: ['辦公桌椅', '公共區域', '茶水間', '廁所清潔', '垃圾清理'],
  },
]

export const DISTRICTS = [
  '中正區', '大同區', '中山區', '松山區', '大安區',
  '萬華區', '信義區', '士林區', '北投區', '內湖區',
  '南港區', '文山區',
]

export const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: '待確認',
  CONFIRMED: '已確認',
  IN_PROGRESS: '進行中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
}

export const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
}

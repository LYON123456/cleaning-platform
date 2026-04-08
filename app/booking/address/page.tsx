'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookingSteps } from '@/components/booking/BookingSteps'
import { SERVICES, DISTRICTS, type ServiceType } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

function AddressPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service') as ServiceType
  const date = searchParams.get('date') ?? ''
  const time = searchParams.get('time') ?? ''

  const service = SERVICES.find((s) => s.id === serviceId)

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    district: '',
    address: '',
    floor: '',
    note: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.customerName.trim()) newErrors.customerName = '請輸入姓名'
    if (!form.customerPhone.match(/^09\d{8}$/)) newErrors.customerPhone = '請輸入正確的手機號碼'
    if (!form.customerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.customerEmail = '請輸入正確的電子郵件'
    if (!form.district) newErrors.district = '請選擇行政區'
    if (!form.address.trim()) newErrors.address = '請輸入詳細地址'
    return newErrors
  }

  const handleContinue = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    const params = new URLSearchParams({
      service: serviceId,
      date,
      time,
      ...form,
    })
    router.push(`/booking/payment?${params}`)
  }

  if (!service) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={`/booking/time?service=${serviceId}`} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span className="font-bold text-teal-700">潔淨家 CleanHome</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <BookingSteps currentStep={3} />

        <div className="mt-6">
          {/* Summary bar */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="text-gray-500 text-xs">服務項目</div>
              <div className="font-medium text-teal-900">{service.icon} {service.name}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">服務日期</div>
              <div className="font-medium text-teal-900">{date}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">開始時間</div>
              <div className="font-medium text-teal-900">{time}</div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">填寫聯絡與地址資訊</h1>
          <p className="text-gray-500 mb-6">請填寫您的聯絡方式及服務地址</p>

          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">聯絡資訊</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">姓名 <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="王小明"
                    value={form.customerName}
                    onChange={(e) => update('customerName', e.target.value)}
                    className={errors.customerName ? 'border-red-400' : ''}
                  />
                  {errors.customerName && <p className="text-xs text-red-500">{errors.customerName}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">手機號碼 <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    placeholder="0912345678"
                    value={form.customerPhone}
                    onChange={(e) => update('customerPhone', e.target.value)}
                    className={errors.customerPhone ? 'border-red-400' : ''}
                  />
                  {errors.customerPhone && <p className="text-xs text-red-500">{errors.customerPhone}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">電子郵件 <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={form.customerEmail}
                  onChange={(e) => update('customerEmail', e.target.value)}
                  className={errors.customerEmail ? 'border-red-400' : ''}
                />
                {errors.customerEmail && <p className="text-xs text-red-500">{errors.customerEmail}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">服務地址</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>縣市</Label>
                  <Input value="台北市" disabled className="bg-gray-50" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>行政區 <span className="text-red-500">*</span></Label>
                  <Select onValueChange={(v) => update('district', v)}>
                    <SelectTrigger className={errors.district ? 'border-red-400' : ''}>
                      <SelectValue placeholder="選擇行政區" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTRICTS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.district && <p className="text-xs text-red-500">{errors.district}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">詳細地址 <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  placeholder="忠孝東路四段1號"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  className={errors.address ? 'border-red-400' : ''}
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="floor">樓層（選填）</Label>
                <Input
                  id="floor"
                  placeholder="5樓"
                  value={form.floor}
                  onChange={(e) => update('floor', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="note">特殊需求或備注（選填）</Label>
                <Textarea
                  id="note"
                  placeholder="例如：有養寵物、需攜帶清潔工具、特別注意某區域..."
                  value={form.note}
                  onChange={(e) => update('note', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Price summary */}
          <div className="bg-white border rounded-lg p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">{service.name} × {service.durationHours}小時</span>
              <span>{formatPrice(service.basePrice)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>合計</span>
              <span className="text-teal-600 text-lg">{formatPrice(service.basePrice)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href={`/booking/time?service=${serviceId}`}>上一步</Link>
            </Button>
            <Button
              onClick={handleContinue}
              className="bg-teal-600 hover:bg-teal-700 px-8"
              size="lg"
            >
              下一步：確認付款
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AddressPage() {
  return (
    <Suspense>
      <AddressPageContent />
    </Suspense>
  )
}

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookingSteps } from '@/components/booking/BookingSteps'
import { SERVICES, type ServiceType } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, CreditCard, Shield, Lock } from 'lucide-react'

function PaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('service') as ServiceType
  const date = searchParams.get('date') ?? ''
  const time = searchParams.get('time') ?? ''
  const customerName = searchParams.get('customerName') ?? ''
  const customerPhone = searchParams.get('customerPhone') ?? ''
  const customerEmail = searchParams.get('customerEmail') ?? ''
  const district = searchParams.get('district') ?? ''
  const address = searchParams.get('address') ?? ''
  const floor = searchParams.get('floor') ?? ''
  const note = searchParams.get('note') ?? ''

  const service = SERVICES.find((s) => s.id === serviceId)
  const [isProcessing, setIsProcessing] = useState(false)

  const getEndTime = (startTime: string): string => {
    if (!startTime || !service) return ''
    const [h, m] = startTime.split(':').map(Number)
    const endH = h + service.durationHours
    return `${String(Math.floor(endH)).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  const handleECPayRedirect = async () => {
    setIsProcessing(true)
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: serviceId,
          scheduledDate: date,
          startTime: time,
          endTime: getEndTime(time),
          durationHours: service?.durationHours ?? 2,
          address,
          district,
          floor: floor || undefined,
          note: note || undefined,
          customerName,
          customerEmail,
          customerPhone,
          basePrice: service?.basePrice ?? 0,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error('建立訂單失敗', err)
        setIsProcessing(false)
        return
      }

      const { paymentUrl } = await res.json()
      // 跳轉至 ECPay（模擬或正式）
      window.location.href = paymentUrl
    } catch (err) {
      console.error('付款流程錯誤', err)
      setIsProcessing(false)
    }
  }

  if (!service) return null

  const fullAddress = `台北市${district}${address}${floor ? ` ${floor}` : ''}`

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href={`/booking/address?service=${serviceId}&date=${date}&time=${time}`}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span className="font-bold text-teal-700">潔淨家 CleanHome</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <BookingSteps currentStep={4} />

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">確認訂單與付款</h1>
          <p className="text-gray-500 mb-6">請確認以下訂單資訊後，點擊前往付款</p>

          {/* Order Summary */}
          <Card className="mb-4">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">訂單摘要</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">服務項目</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{service.icon} {service.name}</span>
                    <Link href="/booking" className="text-xs text-teal-600 hover:underline">修改</Link>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">服務日期</span>
                  <span className="font-medium">{date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">服務時間</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{time} – {getEndTime(time)}（{service.durationHours}小時）</span>
                    <Link href="/booking/time" className="text-xs text-teal-600 hover:underline">修改</Link>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">服務地址</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-right max-w-[160px]">{fullAddress}</span>
                    <Link href="/booking/address" className="text-xs text-teal-600 hover:underline flex-shrink-0">修改</Link>
                  </div>
                </div>
                {note && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">備注</span>
                    <span className="font-medium text-right max-w-[200px]">{note}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card className="mb-4">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">聯絡資訊</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">姓名</span>
                  <span className="font-medium">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">電話</span>
                  <span className="font-medium">{customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">電子郵件</span>
                  <span className="font-medium">{customerEmail}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">費用明細</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{service.name}（{service.durationHours}小時）</span>
                  <span>{formatPrice(service.basePrice)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>服務費</span>
                  <span>已含</span>
                </div>
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>應付總額</span>
                <span className="text-teal-600">{formatPrice(service.basePrice)}</span>
              </div>
            </CardContent>
          </Card>

          {/* ECPay Payment */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">綠界科技 ECPay 付款</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">
                點擊下方按鈕將跳轉至綠界支付頁面，支援信用卡、ATM 轉帳、超商代碼繳費
              </p>
              <div className="flex items-center gap-4 text-xs text-blue-600">
                <div className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  <span>SSL 加密保護</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" />
                  <span>PCI DSS 認證</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href={`/booking/address?service=${serviceId}&date=${date}&time=${time}`}>
                上一步
              </Link>
            </Button>
            <Button
              onClick={handleECPayRedirect}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 px-8"
              size="lg"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  處理中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  前往 ECPay 付款 {formatPrice(service.basePrice)}
                </span>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-3">
            預約 24 小時前可免費取消，12 小時前取消退款 50%。{' '}
            <Link href="#" className="underline hover:text-teal-600">詳見服務條款</Link>
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            ※ 此為模擬付款環境，不會產生真實交易
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentPageContent />
    </Suspense>
  )
}

'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Calendar, MapPin, Clock, Receipt } from 'lucide-react'
import { SERVICES, type ServiceType } from '@/types'
import { formatPrice } from '@/lib/utils'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const orderNo = searchParams.get('orderNo') ?? ''
  const serviceType = searchParams.get('serviceType') as ServiceType
  const date = searchParams.get('date') ?? ''
  const time = searchParams.get('time') ?? ''
  const address = searchParams.get('address') ?? ''
  const amount = Number(searchParams.get('amount') ?? 0)

  const service = SERVICES.find((s) => s.id === serviceType)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* 成功圖示 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">付款成功！</h1>
          <p className="text-gray-500 mt-2">您的清潔服務預約已確認，我們將為您安排師傅</p>
        </div>

        {/* 訂單資訊 */}
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-sm text-gray-500 flex items-center gap-1.5">
                <Receipt className="h-4 w-4" />
                訂單編號
              </span>
              <span className="font-mono text-sm font-semibold text-gray-900">{orderNo}</span>
            </div>

            {service && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">服務項目</span>
                <span className="font-medium">
                  {service.icon} {service.name}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                服務日期
              </span>
              <span className="font-medium">{date}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                服務時間
              </span>
              <span className="font-medium">{time}</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="h-4 w-4" />
                服務地址
              </span>
              <span className="font-medium text-right max-w-[220px]">{address}</span>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <span className="font-semibold text-gray-900">實付金額</span>
              <span className="text-xl font-bold text-green-600">{formatPrice(amount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* 後續說明 */}
        <Card className="mb-6 bg-teal-50 border-teal-200">
          <CardContent className="p-5">
            <h3 className="font-semibold text-teal-900 mb-3">接下來會發生什麼？</h3>
            <ol className="space-y-2 text-sm text-teal-800">
              <li className="flex gap-2">
                <span className="font-bold shrink-0">1.</span>
                <span>系統將在 30 分鐘內為您分配師傅，並發送確認簡訊</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold shrink-0">2.</span>
                <span>師傅會在服務當天前 1 小時與您聯絡確認</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold shrink-0">3.</span>
                <span>服務完成後可透過 Email 評價師傅</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/">返回首頁</Link>
          </Button>
          <Button asChild className="flex-1 bg-teal-600 hover:bg-teal-700">
            <Link href="/booking">再次預約</Link>
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ※ 此為模擬付款環境，訂單僅供測試使用
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessPageContent />
    </Suspense>
  )
}

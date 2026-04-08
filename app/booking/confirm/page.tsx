'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Calendar, MapPin, Clock, Mail, Phone, Home } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

function ConfirmPageContent() {
  const searchParams = useSearchParams()
  const orderNo = searchParams.get('orderNo') ?? ''
  const service = searchParams.get('service') ?? ''
  const date = searchParams.get('date') ?? ''
  const time = searchParams.get('time') ?? ''
  const customerName = searchParams.get('customerName') ?? ''
  const customerEmail = searchParams.get('customerEmail') ?? ''
  const address = searchParams.get('address') ?? ''
  const amount = Number(searchParams.get('amount') ?? '0')
  const status = searchParams.get('status')

  const serviceNames: Record<string, string> = {
    REGULAR: '一般清潔',
    DEEP: '深度清潔',
    MOVE_IN_OUT: '搬家清潔',
    OFFICE: '辦公室清潔',
  }

  if (status !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">付款失敗</h1>
            <p className="text-gray-500 mb-6">很抱歉，付款未能完成，請重新嘗試</p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/booking">重新預約</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <span className="text-lg">🏠</span>
          <span className="font-bold text-teal-700">潔淨家 CleanHome</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-lg">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">預約成功！</h1>
          <p className="text-gray-500">您的清潔服務已預約成功，我們將為您安排最合適的師傅</p>
        </div>

        {/* Order info */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">訂單資訊</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                已付款
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-4 font-mono">訂單編號：{orderNo}</div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Home className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs">服務項目</div>
                  <div className="font-medium">{serviceNames[service] ?? service}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs">服務日期</div>
                  <div className="font-medium">{date}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs">開始時間</div>
                  <div className="font-medium">{time}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs">服務地址</div>
                  <div className="font-medium">{address}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs">確認信已寄送至</div>
                  <div className="font-medium">{customerEmail}</div>
                </div>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between">
              <span className="font-medium">已付金額</span>
              <span className="font-bold text-teal-600 text-lg">{formatPrice(amount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* What's next */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-5">
            <h4 className="font-semibold text-blue-900 mb-3">接下來會發生什麼？</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>我們將在 30 分鐘內確認您的預約並發送確認簡訊</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>服務前一天我們會聯繫您確認細節並告知師傅資訊</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>師傅將於預約時間準時到達，完成後請在 App 確認完工</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Button asChild className="bg-teal-600 hover:bg-teal-700 w-full" size="lg">
            <Link href="/">返回首頁</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/booking">再預約一次</Link>
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          如有疑問請聯繫客服：0800-123-456<br />
          服務時間 週一至週日 09:00–21:00
        </p>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmPageContent />
    </Suspense>
  )
}

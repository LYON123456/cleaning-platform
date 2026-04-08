'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookingSteps } from '@/components/booking/BookingSteps'
import { SERVICES, type ServiceType } from '@/types'
import { formatPrice } from '@/lib/utils'
import { CheckCircle, ArrowLeft } from 'lucide-react'

function BookingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselected = searchParams.get('service') as ServiceType | null
  const [selected, setSelected] = useState<ServiceType | null>(preselected)

  const handleContinue = () => {
    if (!selected) return
    router.push(`/booking/time?service=${selected}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span className="font-bold text-teal-700">潔淨家 CleanHome</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BookingSteps currentStep={1} />

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">選擇清潔服務</h1>
          <p className="text-gray-500 mb-8">請選擇最符合您需求的清潔方案</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {SERVICES.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all border-2 ${
                  selected === service.id
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-gray-200 hover:border-teal-300 hover:shadow-sm'
                }`}
                onClick={() => setSelected(service.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{service.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-xs text-gray-500">約 {service.durationHours} 小時</p>
                      </div>
                    </div>
                    {selected === service.id && (
                      <CheckCircle className="h-6 w-6 text-teal-500 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                  <ul className="space-y-1 mb-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-xs text-gray-500 flex items-center gap-1.5">
                        <CheckCircle className="h-3 w-3 text-teal-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between">
                    <span className="text-teal-600 font-bold text-lg">
                      {formatPrice(service.basePrice)}
                    </span>
                    <span className="text-xs text-gray-400">起</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/">返回首頁</Link>
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selected}
              className="bg-teal-600 hover:bg-teal-700 px-8"
              size="lg"
            >
              下一步：選擇時間
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense>
      <BookingPageContent />
    </Suspense>
  )
}

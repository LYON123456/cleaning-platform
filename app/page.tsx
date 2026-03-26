import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SERVICES } from '@/types'
import { CheckCircle, Star, Shield, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-teal-700">潔淨家 CleanHome</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#services" className="text-gray-600 hover:text-teal-700">服務項目</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-teal-700">如何運作</Link>
            <Link href="/cleaner/login" className="text-gray-600 hover:text-teal-700">師傅登入</Link>
            <Link href="/admin/login" className="text-gray-600 hover:text-teal-700">管理後台</Link>
          </nav>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/booking">立即預約</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50 to-cyan-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            讓家煥然一新<br />
            <span className="text-teal-600">專業清潔，輕鬆搞定</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            嚴格審核的專業師傅，彈性預約時間，全程有保障。
            台北市 12 個行政區，30 分鐘內確認預約。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg px-8">
              <Link href="/booking">立即預約清潔</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="#how-it-works">了解更多</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-500" />
              <span>已服務 3,000+ 家庭</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>平均評分 4.9 / 5.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>全程責任保險</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span>彈性時段預約</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-teal-700">1,200+</div>
              <div className="text-sm text-gray-500">完成服務次數</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-700">4.8 ⭐</div>
              <div className="text-sm text-gray-500">平均客戶評分</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-700">98%</div>
              <div className="text-sm text-gray-500">準時到達率</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-700">NT$10萬</div>
              <div className="text-sm text-gray-500">損害賠償保障</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">服務項目</h2>
          <p className="text-center text-gray-500 mb-12">選擇最適合您的清潔方案</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-teal-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{service.description}</p>
                  <div className="text-teal-600 font-bold text-lg mb-3">
                    NT$ {service.basePrice.toLocaleString()} 起
                  </div>
                  <div className="text-xs text-gray-400 mb-4">約 {service.durationHours} 小時</div>
                  <ul className="space-y-1 mb-4">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-xs text-gray-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-teal-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full bg-teal-600 hover:bg-teal-700" size="sm">
                    <Link href={`/booking?service=${service.id}`}>選擇此方案</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">如何運作</h2>
          <p className="text-center text-gray-500 mb-12">4 個簡單步驟，輕鬆完成預約</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: '📋', title: '選擇服務', desc: '選擇適合的清潔方案與時數' },
              { step: '2', icon: '📅', title: '預約時間', desc: '選擇您方便的日期與時間段' },
              { step: '3', icon: '📍', title: '填寫地址', desc: '輸入服務地址與特殊需求' },
              { step: '4', icon: '✅', title: '確認付款', desc: '線上付款，等待師傅上門' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-700 text-2xl mb-4">
                  {item.icon}
                </div>
                <div className="text-sm font-medium text-teal-600 mb-1">步驟 {item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Link href="/booking">開始預約</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">客戶真實評價</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: '陳小姐', area: '台北大安區', service: '深度清潔', rating: 5, comment: '師傅非常專業，連冰箱縫隙都清得乾淨，下次還要預約同一位！' },
              { name: '林先生', area: '新北板橋', service: '定期清潔', rating: 5, comment: '每週固定預約，師傅準時到達、做事有條理，家裡煥然一新。' },
              { name: '王媽媽', area: '台北信義區', service: '搬家清潔', rating: 5, comment: '搬家前後都請潔淨家，效率高品質好，強烈推薦給有需要的朋友！' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => <span key={j} className="text-yellow-400">⭐</span>)}
                </div>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">&ldquo;{t.comment}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.area} · {t.service}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏠</span>
              <span className="text-white font-semibold">潔淨家 CleanHome</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/cleaner/login" className="hover:text-white">師傅入口</Link>
              <Link href="/admin/login" className="hover:text-white">管理後台</Link>
              <span>客服：0800-123-456</span>
            </div>
            <p className="text-xs">© 2024 潔淨家 CleanHome. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

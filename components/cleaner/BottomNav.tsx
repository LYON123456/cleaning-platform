'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/cleaner/dashboard', icon: '📋', label: '訂單' },
  { href: '/cleaner/schedule', icon: '📅', label: '排班' },
  { href: '#', icon: '👤', label: '帳號' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = tab.href !== '#' && pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center h-16 text-xs gap-1 transition-colors ${
                isActive ? 'text-teal-600' : 'text-gray-500 hover:text-teal-500'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className={`font-medium ${isActive ? 'text-teal-600' : ''}`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

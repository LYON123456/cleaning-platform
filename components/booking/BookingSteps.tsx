import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  id: number
  label: string
}

const steps: Step[] = [
  { id: 1, label: '選擇服務' },
  { id: 2, label: '選擇時間' },
  { id: 3, label: '填寫地址' },
  { id: 4, label: '確認付款' },
]

interface BookingStepsProps {
  currentStep: number
}

export function BookingSteps({ currentStep }: BookingStepsProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors',
                  currentStep > step.id
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : currentStep === step.id
                    ? 'border-teal-600 text-teal-600 bg-teal-50'
                    : 'border-gray-300 text-gray-400 bg-white'
                )}
              >
                {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium hidden sm:block',
                  currentStep >= step.id ? 'text-teal-700' : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-colors',
                  currentStep > step.id ? 'bg-teal-600' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

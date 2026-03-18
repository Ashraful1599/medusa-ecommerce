import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3
const STEPS = [
  { id: 1, label: "Shipping" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review" },
]

export function StepIndicator({ currentStep }: { currentStep: Step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
              currentStep > step.id
                ? "bg-[#111111] border-[#111111] text-white"
                : currentStep === step.id
                  ? "border-[#111111] text-[#111111] bg-white"
                  : "border-[#E5E5E5] text-[#999999] bg-white"
            )}>
              {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <span className={cn(
              "text-xs font-medium",
              currentStep >= step.id ? "text-[#111111]" : "text-[#999999]"
            )}>{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn(
              "h-0.5 w-16 sm:w-24 mb-4 transition-colors",
              currentStep > step.id ? "bg-[#111111]" : "bg-[#E5E5E5]"
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

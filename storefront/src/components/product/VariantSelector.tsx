"use client"
import { cn } from "@/lib/utils"
import type { HttpTypes } from "@medusajs/types"

interface VariantSelectorProps {
  product: HttpTypes.StoreProduct
  selectedVariantId: string | null
  onVariantChange: (variantId: string) => void
}

// Build option maps for display
function buildOptionMap(product: HttpTypes.StoreProduct) {
  const options = product.options ?? []
  return options.map(option => ({
    id: option.id,
    title: option.title,
    values: option.values?.map(v => v.value) ?? [],
  }))
}

// Find which variant matches the selected options
function findVariant(product: HttpTypes.StoreProduct, selectedOptions: Record<string, string>) {
  return product.variants?.find(v =>
    v.options?.every(o => selectedOptions[o.option_id ?? ""] === o.value)
  )
}

export function VariantSelector({ product, selectedVariantId, onVariantChange }: VariantSelectorProps) {
  const optionMap = buildOptionMap(product)

  // Derive selected options from selectedVariantId
  const selectedVariant = product.variants?.find(v => v.id === selectedVariantId)
  const selectedOptions: Record<string, string> = {}
  selectedVariant?.options?.forEach(o => {
    if (o.option_id) selectedOptions[o.option_id] = o.value ?? ""
  })

  const handleOptionClick = (optionId: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionId]: value }
    const variant = findVariant(product, newOptions)
    if (variant?.id) onVariantChange(variant.id)
  }

  return (
    <div className="space-y-4">
      {optionMap.map(option => (
        <div key={option.id}>
          <p className="text-sm font-semibold text-[#111111] mb-2">
            {option.title}
            {selectedOptions[option.id] && (
              <span className="font-normal text-[#999999] ml-1">: {selectedOptions[option.id]}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map(value => {
              const isSelected = selectedOptions[option.id] === value
              return (
                <button
                  key={value}
                  onClick={() => handleOptionClick(option.id, value)}
                  className={cn(
                    "px-3 py-1.5 text-sm border rounded-sm transition-colors",
                    isSelected
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "border-[#E5E5E5] text-[#111111] hover:border-[#111111]"
                  )}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

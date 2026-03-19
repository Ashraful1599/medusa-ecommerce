"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { HttpTypes } from "@medusajs/types"

interface VariantSelectorProps {
  product: HttpTypes.StoreProduct
  selectedVariantId: string | null
  onVariantChange: (variantId: string) => void
}

function buildOptionMap(product: HttpTypes.StoreProduct) {
  return (product.options ?? []).map(option => ({
    id: option.id!,
    title: option.title,
    values: [...new Set(option.values?.map(v => v.value).filter(Boolean) as string[])],
  }))
}

function findVariant(product: HttpTypes.StoreProduct, selectedOptions: Record<string, string>) {
  return product.variants?.find(v =>
    v.options?.every(o => selectedOptions[o.option_id ?? ""] === o.value)
  )
}

export function VariantSelector({ product, selectedVariantId, onVariantChange }: VariantSelectorProps) {
  const optionMap = buildOptionMap(product)

  // Local state so buttons respond immediately regardless of variant match
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    const preselected = product.variants?.find(v => v.id === selectedVariantId)
    preselected?.options?.forEach(o => {
      if (o.option_id) initial[o.option_id] = o.value ?? ""
    })
    return initial
  })

  const handleOptionClick = (optionId: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionId]: value }
    setSelectedOptions(newOptions)
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

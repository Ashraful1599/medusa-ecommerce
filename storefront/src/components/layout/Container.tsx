import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  fullWidth?: boolean
  className?: string
}

export function Container({ children, fullWidth, className }: ContainerProps) {
  if (fullWidth) {
    return <div className={cn("w-full", className)}>{children}</div>
  }
  return (
    <div className={cn("max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  )
}

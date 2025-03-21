import { cn } from "@/lib/utils"

interface TitleProps {
  children: React.ReactNode
  className?: string
}

// Defining custom Title Component
export function Title({ children, className }: TitleProps) {
  return (
    <h1 
      className={cn(
        "text-7xl md:leading-normal leading-none text-white font-semibold tracking-tighter",
        className
      )}
    >
      {children}
    </h1>
  )
}
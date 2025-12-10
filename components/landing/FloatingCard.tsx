"use client"

import { ReactNode } from "react"

interface FloatingCardProps {
  children: ReactNode
  delay?: number
  amplitude?: number
  className?: string
}

export function FloatingCard({
  children,
  delay = 0,
  amplitude = 20,
  className = ""
}: FloatingCardProps) {
  const animationStyle = {
    animationDelay: `${delay}s`,
    animationDuration: `${6 + delay}s`,
  }

  return (
    <div
      className={`animate-float ${className}`}
      style={animationStyle}
    >
      {children}
    </div>
  )
}

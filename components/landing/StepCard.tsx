import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StepCardProps {
  step: number
  title: string
  description: string
  icon: ReactNode
}

export function StepCard({ step, title, description, icon }: StepCardProps) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Step number circle */}
      <div className="mb-6 relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
          {step}
        </div>
        {/* Icon container */}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white shadow-md">
          {icon}
        </div>
      </div>

      <Card className="w-full hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

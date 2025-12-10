import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UseCaseCardProps {
  industry: string
  description: string
  metric: string
  icon: ReactNode
  iconBgColor?: string
}

export function UseCaseCard({
  industry,
  description,
  metric,
  icon,
  iconBgColor = "from-blue-500 to-purple-500"
}: UseCaseCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="relative">
        {/* Icon container */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconBgColor} flex items-center justify-center mb-4 text-white shadow-lg`}>
          {icon}
        </div>

        <CardTitle className="text-xl mb-2">{industry}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>

      <CardContent className="relative">
        <Badge variant="secondary" className="text-sm">
          {metric}
        </Badge>
      </CardContent>
    </Card>
  )
}

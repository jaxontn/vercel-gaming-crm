import { IconCheck } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PricingCardProps {
  plan: string
  price: string | number
  period?: string
  description: string
  features: string[]
  popular?: boolean
  cta: string
  ctaVariant?: "default" | "outline"
}

export function PricingCard({
  plan,
  price,
  period = "/month",
  description,
  features,
  popular = false,
  cta,
  ctaVariant = "default"
}: PricingCardProps) {
  return (
    <Card
      className={`relative h-full flex flex-col transition-all duration-300 hover:shadow-2xl ${
        popular
          ? "border-2 border-primary shadow-xl scale-105"
          : "hover:scale-105"
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className={popular ? "pt-8" : ""}>
        <CardTitle className="text-2xl">{plan}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-5xl font-bold tracking-tight">
              {typeof price === "number" ? `$${price}` : price}
            </span>
            {typeof price === "number" && (
              <span className="ml-2 text-muted-foreground">{period}</span>
            )}
          </div>
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <IconCheck className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground/90">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          variant={popular ? "default" : ctaVariant}
          className={`w-full ${popular ? "animate-glow" : ""}`}
          size="lg"
        >
          {cta}
        </Button>
      </CardFooter>
    </Card>
  )
}

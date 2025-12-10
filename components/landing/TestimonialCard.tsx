import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface TestimonialCardProps {
  quote: string
  author: string
  title: string
  company: string
  metric?: string
  initials?: string
}

export function TestimonialCard({
  quote,
  author,
  title,
  company,
  metric,
  initials
}: TestimonialCardProps) {
  const authorInitials = initials || author.split(' ').map(n => n[0]).join('')

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 pt-6">
        {/* Quote marks decoration */}
        <div className="text-5xl text-muted-foreground/20 mb-4 font-serif leading-none">"</div>

        <blockquote className="text-lg italic text-foreground/90 mb-4">
          {quote}
        </blockquote>

        {metric && (
          <Badge variant="secondary" className="mb-4">
            {metric}
          </Badge>
        )}
      </CardContent>

      <CardFooter className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
            {authorInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-foreground">{author}</div>
          <div className="text-sm text-muted-foreground">
            {title} at {company}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

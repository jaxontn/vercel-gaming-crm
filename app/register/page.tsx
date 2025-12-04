import { RegisterForm } from "@/components/register-form"
import { AuthGuard } from "@/components/auth-guard"

export default function RegisterPage() {
  return (
    <AuthGuard redirectTo="/dashboard" requireAuth={false}>
      <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </AuthGuard>
  )
}
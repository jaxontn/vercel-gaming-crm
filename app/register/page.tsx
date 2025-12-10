import { RegisterForm } from "@/components/register-form"
import { AuthGuard } from "@/components/auth-guard"

export default function RegisterPage() {
  return (
    <AuthGuard redirectTo="/dashboard" requireAuth={false}>
      <div className="h-svh grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-violet-50 to-fuchsia-50 overflow-hidden">
        {/* Left Side - Branding Section */}
        <div className="hidden lg:flex flex-col justify-center items-center p-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-md text-center">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-3">Join the Gamification Revolution!</h1>
            <p className="text-lg text-violet-100 mb-6">
              Start engaging customers with interactive games and grow your business today
            </p>
            <div className="space-y-3 text-left bg-white/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">14-day Free Trial</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">Instant Setup</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex flex-col justify-center items-center p-4 md:p-6 overflow-y-auto">
          <div className="w-full max-w-lg max-h-full">
            <RegisterForm />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
'use client';

import { useState } from 'react';
import { GalleryVerticalEnd, ArrowLeft } from "lucide-react"
import Link from 'next/link';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/lib/auth';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      // Use the unified login function that routes to merchants authentication
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Enhanced Form Container */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-violet-500/20 border border-violet-100 p-8 backdrop-blur-sm bg-white/95">
        {/* Back to Home Button */}
        <div className="flex justify-start mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-4 text-center mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <GalleryVerticalEnd className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Gamified CRM
                </h1>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Welcome Back!</h2>
              <FieldDescription className="text-base text-gray-600">
                Access your merchant dashboard and start gamifying customer experiences
              </FieldDescription>
            </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <Field>
              <FieldLabel htmlFor="email" className="text-gray-700 font-medium">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="merchant@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-violet-500/20 transition-all"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="text-gray-700 font-medium">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-violet-500/20 transition-all"
              />
            </Field>
          </div>

          <Field className="mt-8">
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : (
                'Login to Dashboard'
              )}
            </Button>
          </Field>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                Create your free account
              </Link>
            </div>
          </div>
        </FieldGroup>
      </form>

      {/* Terms Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <FieldDescription className="text-center text-xs text-gray-500">
          By logging in, you agree to our{' '}
          <a href="#" className="text-violet-600 hover:text-violet-700 transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-violet-600 hover:text-violet-700 transition-colors">
            Privacy Policy
          </a>
        </FieldDescription>
      </div>
      </div>
    </div>
  )
}
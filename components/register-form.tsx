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
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { registerMerchant } = useAuth();
  const [formData, setFormData] = useState({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.business_name || !formData.contact_name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Use the registerMerchant function from auth context
      await registerMerchant(
        formData.business_name,
        formData.contact_name,
        formData.email,
        formData.phone,
        formData.password
      );

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Enhanced Form Container */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-violet-500/20 border border-violet-100 p-6 backdrop-blur-sm bg-white/95">
        {/* Back to Home Button */}
        <div className="flex justify-start mb-4">
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
            <div className="flex flex-col items-center gap-3 text-center mb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <GalleryVerticalEnd className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Gamified CRM
                </h1>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Create Your Account</h2>
              <FieldDescription className="text-sm text-gray-600">
                Start your 14-day free trial and transform customer engagement
              </FieldDescription>
            </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl mb-4">
              {success}
            </div>
          )}

          {/* Business Information */}
          <div className="space-y-4 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="business_name" className="text-gray-700 font-medium">Business Name *</FieldLabel>
                <Input
                  id="business_name"
                  name="business_name"
                  type="text"
                  placeholder="Your business name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-10 border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="contact_name" className="text-gray-700 font-medium">Contact Name *</FieldLabel>
                <Input
                  id="contact_name"
                  name="contact_name"
                  type="text"
                  placeholder="Full name of contact person"
                  value={formData.contact_name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-10 border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="email" className="text-gray-700 font-medium">Email Address *</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="business@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="h-10 border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500/20 transition-all"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="phone" className="text-gray-700 font-medium">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="h-10 border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="address" className="text-gray-700 font-medium">Business Address</FieldLabel>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter your business address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="h-10 border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                />
              </Field>
            </div>
          </div>

          {/* Password Fields */}
          <div className="space-y-3 mb-4">
            <div className="border-t border-gray-100 pt-3">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Account Security</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password" className="text-gray-700 font-medium">Password *</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="h-10 border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                  />
                  <FieldDescription className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password *</FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="h-10 border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                  />
                </Field>
              </div>
            </div>
          </div>

          <Field className="mt-2">
            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold rounded-lg shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                'Start Free Trial'
              )}
            </Button>
          </Field>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </FieldGroup>
      </form>

      {/* Terms Section */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <FieldDescription className="text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-violet-600 hover:text-violet-700 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-violet-600 hover:text-violet-700 transition-colors">
            Privacy Policy
          </Link>.
        </FieldDescription>
      </div>
      </div>
    </div>
  )
}
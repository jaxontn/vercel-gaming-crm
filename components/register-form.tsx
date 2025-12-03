'use client';

import { useState } from 'react';
import { GalleryVerticalEnd } from "lucide-react"
import Link from 'next/link';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Gamified CRM</span>
            </Link>
            <h1 className="text-xl font-bold">Register Your Business</h1>
            <FieldDescription>
              Create your merchant account to start gamifying your customer experience
            </FieldDescription>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md">
              {success}
            </div>
          )}

          {/* Business Information */}
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="business_name">Business Name *</FieldLabel>
              <Input
                id="business_name"
                name="business_name"
                type="text"
                placeholder="Your business name"
                value={formData.business_name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact_name">Contact Name *</FieldLabel>
              <Input
                id="contact_name"
                name="contact_name"
                type="text"
                placeholder="Full name of contact person"
                value={formData.contact_name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email Address *</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="business@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="address">Business Address</FieldLabel>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter your business address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </Field>
          </div>

          <FieldSeparator>Account Security</FieldSeparator>

          {/* Password Fields */}
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="password">Password *</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              <FieldDescription>
                Password must be at least 8 characters long
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password *</FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </Field>
          </div>

          <Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Field>

          <FieldSeparator />

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => router.push('/login')}
            >
              Sign in here
            </Button>
          </div>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="underline hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline hover:text-primary">
          Privacy Policy
        </Link>.
      </FieldDescription>
    </div>
  )
}
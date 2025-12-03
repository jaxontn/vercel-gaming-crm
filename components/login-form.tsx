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
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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
            <h1 className="text-xl font-bold">Welcome to Gamified CRM</h1>
            <FieldDescription>
              Login to access your merchant dashboard
            </FieldDescription>
          </div>
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="merchant@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </Field>
          <Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Field>

          <div className="text-center text-sm">
            Dont have an account?{' '}
            <Link
              href="/register"
              className="underline hover:text-primary"
            >
              Register here
            </Link>
          </div>
          {/*<FieldSeparator>Or continue with</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button" disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.047.026-3.91 1.09-3.91 2.183 0 2.357 1.047 3.915 2.098.082.007.211.018.325.018.65 0 1.637-.026 2.676-.104 1.198-.083 1.815-.287 2.117-.208.513-.567.634-.997 1.208-.411 2.047-.787 2.559-1.597.115-.122-.375-.255-.572-.328-.954-.046-.18-.144-.289-.32-.439-.386-.572-.734-1.433-.806-1.67-.12-.632-.12-1.317 0-1.236.567-3.675 1.636-4.877 1.046-1.16 2.338-1.773 3.714-1.773 1.454 0 2.482.548 3.25 1.453.053-.338.13-.678.207-.997.063-.445.03-.573.04-.663 0-.76-.047-1.688-.153-3.913.153-2.357 0-4.005 1.173-5.094 2.338-1.087 1.772-1.207 3.64-1.207 1.089 0 2.116.548 3.105 1.453.156-.388.312-.678.458-1.205.057-.654.083-.94.083-1.57 0-.58-.04-1.467-.105-3.38.105-.379 0-1.516.136-2.567.387-3.24.843-1.717 1.815-2.427 3.59-2.427 2.16 0 3.91.548 5.104 2.427.057.24.14.572.207.997.13.572.29.038.688.326.983.287.983.559.037.529.037.348-.263 2.853-4.125 3.409-1.236 2.854-4.126 3.366-1.637.688-3.675 1.688-2.065 0-3.342-1.657-3.543-2.406-.243-.617-.375-1.073-.047-1.467.083-3.182.125-4.559.083-1.368.057-2.804-.104-4.498.01.54.047 1.401.147 2.717.287 3.714.098.406.198.635.274.884.109.498.187.822.227 1.105.145.656.32 1.094.284.652.47 1.032.688.984.311.589.516.915 1.52.516 2.054.237 1.012.574 1.354 1.009.599 1.708.599 1.47 0 2.607-.548 3.907-1.636 1.046-1.16 2.338-1.773 3.714-1.773zm-15.48 6.896c.843 0 1.4.012.273 1.245-.103.207-.052.364-.157.559-.377.018-.082.03-.183.025-.275.03-.65 0-.76-.047-1.688-.153-3.913.153-2.357 0-4.005 1.173-5.094 2.338-1.087 1.772-1.207 3.64-1.207 1.089 0 2.116.548 3.105 1.453.156-.388.312-.678.458-1.205.057-.654.083-.94.083-1.57 0-.58-.04-1.467-.105-3.38.105-.379 0-1.516.136-2.567.387-3.24.843-1.717 1.815-2.427 3.59-2.427 2.16 0 3.91.548 5.104 2.427.057.24.14.572.207.997.13.572.29.038.688.326.983.287.983.559.037.529.037.348-.263 2.853-4.125 3.409-1.236 2.854-4.126 3.366-1.637.688-3.675 1.688-2.065 0-3.342-1.657-3.543-2.406-.243-.617-.375-1.073-.047-1.467.083-3.182.125-4.559.083-1.368.057-2.804-.104-4.498.01.54.047 1.401.147 2.717.287 3.714.098.406.198.635.274.884.109.498.187.822.227 1.105.145.656.32 1.094.284.652.47 1.032.688.984.311.589.516.915 1.52.516 2.054.237 1.012.574 1.354 1.009.599 1.708.599 1.47 0 2.607-.548 3.907-1.636 1.046-1.16 2.338-1.773 3.714-1.773zm15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83.052-2.662.805-3.532 1.818-.788 1.396-2.715.688-3.559 1.09-4.61 1.338-1.104 2.715-1.636 3.714-1.04 2.715-.688 3.559-1.09 4.61-1.338 1.104 2.715 1.636 3.714 1.04-.227 2.597-.987 3.935-1.831 1.37-.658 2.676-1.48 3.675-2.948 1.37-1.22 2.16-2.357 2.16-4.827 0-8.6-3.893-13.993 8.373-1.454 2.597-4.61 4.559-7.667 0-5.213-3.267-9.103-7.667-9.103-4.005 0-5.867 3.267-9.103 7.667-9.103 2.16 0 4.482.548 5.907 2.427 1.207 1.047 1.636 3.935 2.427 5.094 2.357 1.046 1.16 2.338 1.773 3.714 1.773zm-2.795-2.13c0 .23.053.18.11.322.14.33.045.896.18 2.117.287 3.833.437.082-.73.325-1.465.756-2.368-2.16.72-.903.065-1.467.102-3.38.102-.243 0-1.516.136-2.567.387-3.24.843-1.717 1.815-2.427 3.59-2.427 2.16 0 3.91.548 5.104 2.427.057.24.14.572.207.997.13.572.29.038.688.326.983.287.983.559.037.529.037.348-.263 2.853-4.125 3.409-1.236 2.854-4.126 3.366-1.637.688-3.675 1.688-2.065 0-3.342-1.657-3.543-2.406-.243-.617-.375-1.073-.047-1.467.083-3.182.125-4.559.083-1.368.057-2.804-.104-4.498.01.54.047 1.401.147 2.717.287 3.714.098.406.198.635.274.884.109.498.187.822.227 1.105.145.656.32 1.094.284.652.47 1.032.688.984.311.589.516.915 1.52.516 2.054.237 1.012.574 1.354 1.009.599 1.708.599 1.47 0 2.607-.548 3.907-1.636 1.046-1.16 2.338-1.773 3.714-1.773z"
                  fill="currentColor"
                />
              </svg>
              Apple
            </Button>
            <Button variant="outline" type="button" disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-3.6 0-6.267-1.173-8.373-3.675 1.454 1.454 2.338 1.773 3.714 1.773 1.354 0 2.597-.548 3.532-1.636 0-1.317-.026-2.415-.104-3.182.287-3.96 1.18-.787 1.831-1.64 2.376-3.039.043-.18.15-.288.327-.439.386-.572.734-1.433.806-1.67-.12-.632-.12-1.317 0-1.236.567-3.675 1.636-4.877 1.046-1.16 2.338-1.773 3.714-1.773 1.454 0 2.482.548 3.25 1.453.053-.338.13-.678.207-.997.063-.445.03-.573.04-.663 0-.76-.047-1.688-.153-3.913.153-2.357 0-4.005 1.173-5.094 2.338-1.087 1.772-1.207 3.64-1.207 1.089 0 2.116.548 3.105 1.453.156-.388.312-.678.458-1.205.057-.654.083-.94.083-1.57 0-.58-.04-1.467-.105-3.38.105-.379 0-1.516.136-2.567.387-3.24.843-1.717 1.815-2.427 3.59-2.427 2.16 0 3.91.548 5.104 2.427.057.24.14.572.207.997.13.572.29.038.688.326.983.287.983.559.037.529.037.348-.263 2.853-4.125 3.409-1.236 2.854-4.126 3.366-1.637.688-3.675 1.688-2.065 0-3.342-1.657-3.543-2.406-.243-.617-.375-1.073-.047-1.467.083-3.182.125-4.559.083-1.368.057-2.804-.104-4.498.01.54.047 1.401.147 2.717.287 3.714.098.406.198.635.274.884.109.498.187.822.227 1.105.145.656.32 1.094.284.652.47 1.032.688.984.311.589.516.915 1.52.516 2.054.237 1.012.574 1.354 1.009.599 1.708.599 1.47 0 2.607-.548 3.907-1.636 1.046-1.16 2.338-1.773 3.714-1.773z"
                  fill="currentColor"
                />
              </svg>
              Google
            </Button>
          </Field>*/}
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
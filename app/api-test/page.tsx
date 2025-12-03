'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Server, Database, Globe, Shield, Activity, Key } from 'lucide-react';
import { apiClient, callApi, setApiAuth, isApiAuthenticated } from '@/lib/api-client';

interface LegacyAPIResponse {
  session: {
    status: string;
    message: string;
    user_data?: Record<string, unknown>;
  };
  permission: {
    status: string;
    message: string;
  };
  data: {
    status: string;
    message: string;
    data?: Record<string, unknown>;
    error?: string;
  };
}

export default function APITestPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<LegacyAPIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<boolean>(false);
  const [merchantId, setMerchantId] = useState<string>('');
  const [sessionSecret, setSessionSecret] = useState<string>('');

  useEffect(() => {
    // Check authentication status
    setAuthStatus(isApiAuthenticated());

    // Get stored auth data
    const storedId = localStorage.getItem('auth_user_id') || sessionStorage.getItem('id') || '';
    const storedSecret = localStorage.getItem('auth_session_secret') || sessionStorage.getItem('session_secret') || '';

    setMerchantId(storedId);
    setSessionSecret(storedSecret);
  }, []);

  // Set authentication credentials
  const handleSetAuth = () => {
    if (merchantId && sessionSecret) {
      setApiAuth(merchantId, sessionSecret);
      setAuthStatus(true);
      setError(null);
    }
  };

  // Clear authentication
  const handleClearAuth = () => {
    apiClient.clearAuth();
    setAuthStatus(false);
    setMerchantId('');
    setSessionSecret('');
    setResponse(null);
  };

  // Test basic connection using callApi
  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await callApi('api_test', 'test_connection', {
        test_data: 'Hello from frontend',
        timestamp: new Date().toISOString()
      });

      setResponse(result as LegacyAPIResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Test data echo
  const testDataEcho = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await callApi('api_test', 'test_data_echo', {
        message: 'test message',
        numbers: [1, 2, 3],
        nested: {
          key: 'value',
          array: ['a', 'b', 'c']
        }
      });

      setResponse(result as LegacyAPIResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Test database connection
  const testDatabase = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await callApi('api_test', 'test_database', {
        query: 'SELECT test'
      });

      setResponse(result as LegacyAPIResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Test authentication
  const testAuth = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await callApi('api_test', 'test_auth', {
        auth_check: true
      });

      setResponse(result as LegacyAPIResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Test merchants module (if exists)
  const testMerchantsModule = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await callApi('merchants', 'list', {
        page: 1,
        limit: 10
      });

      setResponse(result as LegacyAPIResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Legacy API Test (callApi Pattern)</h1>
          <p className="text-gray-600">Test the legacy API module system using callApi method</p>
        </div>

        {/* Authentication Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Authentication Setup
            </CardTitle>
            <CardDescription>
              Configure session credentials for legacy API calls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="merchantId">Merchant ID / User ID</Label>
                <Input
                  id="merchantId"
                  placeholder="Enter merchant ID"
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sessionSecret">Session Secret</Label>
                <Input
                  id="sessionSecret"
                  type="password"
                  placeholder="Enter session secret"
                  value={sessionSecret}
                  onChange={(e) => setSessionSecret(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleSetAuth}
                disabled={!merchantId || !sessionSecret}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Set Authentication
              </Button>
              <Button
                onClick={handleClearAuth}
                variant="outline"
                className="flex items-center gap-2"
              >
                Clear Authentication
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={authStatus ? 'default' : 'destructive'}>
                {authStatus ? 'Authenticated' : 'Not Authenticated'}
              </Badge>
              {authStatus && (
                <span className="text-sm text-gray-600">
                  Merchant ID: {merchantId}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>API Test Controls</CardTitle>
            <CardDescription>
              Test different modules and methods using the callApi pattern
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={testConnection}
                disabled={loading || !authStatus}
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Test Connection
              </Button>
              <Button
                onClick={testDataEcho}
                disabled={loading || !authStatus}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Test Data Echo
              </Button>
              <Button
                onClick={testDatabase}
                disabled={loading || !authStatus}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Test Database
              </Button>
              <Button
                onClick={testAuth}
                disabled={loading || !authStatus}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Test Auth
              </Button>
              <Button
                onClick={testMerchantsModule}
                disabled={loading || !authStatus}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Test Merchants
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <XCircle className="w-5 h-5" />
                API Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Response Display */}
        {response && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                API Response
              </CardTitle>
              <CardDescription>
                Last updated: {new Date().toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Session Status */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Session Status
                </h3>
                <div className="flex gap-4">
                  <div>
                    <Badge variant={response.session.status === 'YES' ? 'default' : 'destructive'}>
                      Session: {response.session.status}
                    </Badge>
                  </div>
                  <div>
                    <Badge variant={response.permission.status === 'YES' ? 'default' : 'destructive'}>
                      Permission: {response.permission.status}
                    </Badge>
                  </div>
                  <div>
                    <Badge variant={response.data.status === 'SUCCESS' ? 'default' : 'destructive'}>
                      Data: {response.data.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Messages */}
              <div className="space-y-2">
                <h3 className="font-medium">Messages</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Session:</span> {response.session.message}</p>
                  <p><span className="font-medium">Permission:</span> {response.permission.message}</p>
                  <p><span className="font-medium">Data:</span> {response.data.message}</p>
                </div>
              </div>

              {/* Response Data */}
              {response.data.data && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Response Data
                    </h3>
                    <div className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                      <pre className="text-xs">
                        {JSON.stringify(response.data.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                </>
              )}

              {/* Full Response JSON */}
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Full Response</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto max-h-96">
                  <pre className="text-xs">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              API Call Pattern
            </CardTitle>
            <CardDescription>
              How to use the callApi method in your components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-medium mb-2">Usage Example:</p>
              <pre className="text-sm bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`// Import the callApi function
import { callApi } from '@/lib/api-client';

// Use in your component
const result = await callApi('merchants', 'create', {
  business_name: 'Test Business',
  email: 'test@example.com'
});

// Response format:
{
  session: { status: 'YES', message: '...', user_data: {...} },
  permission: { status: 'YES', message: '...' },
  data: { status: 'SUCCESS', message: '...', data: {...} }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
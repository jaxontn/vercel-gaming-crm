/**
 * API Client for Gaming CRM
 * Follows the legacy callApi pattern for /v1/request/ endpoints
 */

class APIClient {
  private server_domain: string;
  private api_domain: string;
  private userId: string | null = null;
  private secret: string | null = null;

  constructor() {
    // Load server configuration
    this.server_domain = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1/';
    this.api_domain = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1/';

    // Initialize session from localStorage or sessionStorage
    if (typeof window !== 'undefined') {
      this.userId = localStorage.getItem('auth_user_id') || sessionStorage.getItem('id');
      this.secret = localStorage.getItem('auth_session_secret') || sessionStorage.getItem('session_secret');
    }
  }

  /**
   * MD5 hash function (simplified implementation)
   * In production, use a proper crypto library
   */
  private async md5data(data: string): Promise<string> {
    // Simple hash for demo - replace with proper MD5 implementation
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Standard API call method following the legacy pattern
   * @param module Module name (e.g., 'merchants', 'customers', 'fleet_assets')
   * @param method Method name (e.g., 'create', 'read', 'update', 'delete', 'list')
   * @param formData Data to send to the module
   * @returns Promise with the API response
   */
  async callApi(module: string, method: string, formData: Record<string, unknown> = {}) {
    try {
      // Check authentication
      if (!this.userId || !this.secret) {
        throw new Error("Authentication required - User ID or secret not found");
      }

      // Create request ID for tracking
      const requestId = `${module}_${method}_${Date.now()}`;
      const apiUrl = `${this.server_domain}request/`;

      // Prepare the data
      const postData = JSON.stringify(formData);
      const hashedData = await this.md5data(postData + this.secret);

      // Create session object
      const sessionData = {
        module: module,
        method: method,
        id: this.userId,
        hash: hashedData
      };

      // Combine session and data
      const postDataWithSession = JSON.stringify({
        session: sessionData,
        data: formData
      });

      console.log(`--> POST ${apiUrl} [${requestId}]`);
      console.log(postDataWithSession);

      // Make the API call
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: postDataWithSession
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(`<-- Response [${requestId}]`, responseData);

      return responseData;

    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  }

  /**
   * Set authentication credentials
   * @param userId User ID
   * @param secret Session secret
   */
  setAuth(userId: string, secret: string) {
    this.userId = userId;
    this.secret = secret;

    // Store for future use
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user_id', userId);
      localStorage.setItem('auth_session_secret', secret);
      sessionStorage.setItem('id', userId);
      sessionStorage.setItem('session_secret', secret);
    }
  }

  /**
   * Clear authentication
   */
  clearAuth() {
    this.userId = null;
    this.secret = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user_id');
      localStorage.removeItem('auth_session_secret');
      sessionStorage.removeItem('id');
      sessionStorage.removeItem('session_secret');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!(this.userId && this.secret);
  }

  /**
   * Modern REST API call for new endpoints
   * @param endpoint API endpoint (e.g., '/vessels', '/health')
   * @param options Fetch options
   */
  async restCall(endpoint: string, options: RequestInit = {}) {
    const url = `${this.api_domain}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add JWT if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const apiClient = new APIClient();
export default apiClient;

// Export convenience functions
export const callApi = (module: string, method: string, data: Record<string, unknown> = {}) => {
  return apiClient.callApi(module, method, data);
};

export const setApiAuth = (userId: string, secret: string) => {
  return apiClient.setAuth(userId, secret);
};

export const clearApiAuth = () => {
  return apiClient.clearAuth();
};

export const isApiAuthenticated = () => {
  return apiClient.isAuthenticated();
};
/**
   * API Client for Gaming CRM
   * Follows the legacy callApi pattern for /v1/request/ endpoints
   *
   * IMPORTANT: This requires a valid session in the backend user_session table
   * Use login() method to authenticate and create session first
   */

class APIClient {
  private server_domain: string;
  private api_domain: string;
  private userId: string | null = null;
  private secret: string | null = null;

  constructor() {
    // Load server configuration
    // Remove trailing slash to prevent double slashes
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1';
    this.server_domain = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    this.api_domain = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    console.log('[API CLIENT] Initializing with URL:', apiUrl);
    console.log('[API CLIENT] Server domain:', this.server_domain);

    // Initialize session from sessionStorage only
    if (typeof window !== 'undefined') {
      this.userId = sessionStorage.getItem('id');
      this.secret = sessionStorage.getItem('session_secret');
      console.log('[API CLIENT] Initial auth state:', {
        userId: this.userId,
        hasSecret: !!this.secret
      });
    }
  }

  /**
   * MD5 hash function implementation
   * Uses the md5 npm package to match backend PHP MD5 behavior
   */
  private async md5data(data: string): Promise<string> {
    const md5 = (await import('md5')).default;
    return md5(data);
  }

  /**
   * Normalize JSON data to match PHP json_encode behavior
   * CRITICAL: Must exactly match backend normalization in auth.php
   */
  private normalizeJSON(data: Record<string, unknown>): string {
    // Match PHP's JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES flags
    let jsonStr = JSON.stringify(data);

    // Convert [] to {} to match PHP behavior for empty arrays
    if (jsonStr === '[]') {
      jsonStr = '{}';
    }

    return jsonStr;
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
      // Special handling for login - no auth required
      const isLoginCall = module === 'users' && method === 'login';

      console.log(`[API DEBUG] Starting callApi: ${module}.${method}`);
      console.log(`[API DEBUG] Server domain: ${this.server_domain}`);

      // Check authentication - if not set, try to get from sessionStorage
      if (!this.userId || !this.secret) {
        console.log('[API DEBUG] No auth in memory, checking sessionStorage...');
        if (typeof window !== 'undefined') {
          this.userId = sessionStorage.getItem('id');
          this.secret = sessionStorage.getItem('session_secret');
          console.log('[API DEBUG] Retrieved from sessionStorage:');
          console.log('  - userId:', this.userId);
          console.log('  - hasSecret:', !!this.secret);
          console.log('  - hasUserData:', !!sessionStorage.getItem('user_data'));
        }

        // Only throw error if this is not a login call
        if (!isLoginCall && (!this.userId || !this.secret)) {
          console.error('[API ERROR] Authentication required - User ID or secret not found');
          throw new Error("Authentication required - User ID or secret not found");
        }
      }

      // Create request ID for tracking
      const requestId = `${module}_${method}_${Date.now()}`;
      const apiUrl = `${this.server_domain}/request/`;

      // Normalize the data to match backend PHP behavior
      const normalizedData = this.normalizeJSON(formData);

      // Special handling for login - no hash needed since we don't have session yet
      let hashedData = '';

      if (isLoginCall) {
        // For login, we don't have a session secret yet
        // The backend will handle authentication differently for login
        hashedData = '';
      } else {
        // Create hash using normalized data + secret (same as backend)
        // IMPORTANT: Order must match backend auth.php:74 - data FIRST, then secret
        const hashInput = normalizedData + this.secret;
        hashedData = await this.md5data(hashInput);

        console.log(`[API DEBUG] Hash input length: ${hashInput.length}`);
        console.log(`[API DEBUG] Hash input (first 50 chars): ${hashInput.substring(0, 50)}...`);
        console.log(`[API DEBUG] Generated hash: ${hashedData}`);
      }

      // Create session object
      const sessionData = {
        module: module,
        method: method,
        id: isLoginCall ? '' : (this.userId || ''),
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

      // Extract the actual data from the nested response structure
      if (responseData && responseData.data && responseData.data.status) {
        return responseData.data;
      }

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

    // Store in sessionStorage only
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('id', userId);
      sessionStorage.setItem('session_secret', secret);
    }
  }

  /**
   * Login and create session
   * @param email User email
   * @param password User password
   * @param device Device identifier for session tracking
   * @returns Promise with login result
   */
  async login(email: string, password: string, device: string = 'web') {
    try {
      // Use the legacy API pattern for login
      // This will create a session in the backend user_session table
      const loginData = {
        email: email,
        password: password,
        device: device
      };

      // Call the users module with login method
      const response = await this.callApi('users', 'login', loginData);

      // Check if login was successful
      if (response.data && response.data.status === 'SUCCESS') {
        const userData = response.data.user_data;
        const sessionSecret = response.data.session_secret;

        // Set authentication with backend-generated session secret
        this.setAuth(userData.id, sessionSecret);

        console.log('[API DEBUG] Login successful, user ID:', userData.id);
        console.log('[API DEBUG] Session secret set:', sessionSecret.substring(0, 10) + '...');

        return {
          success: true,
          user: userData,
          sessionSecret: sessionSecret,
          message: response.data.message || 'Login successful'
        };
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Set authentication with session secret
   * This should be called after successful login with backend-generated session_secret
   */
  setSession(userId: string, sessionSecret: string) {
    this.userId = userId;
    this.secret = sessionSecret;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('id', userId);
      sessionStorage.setItem('session_secret', sessionSecret);
    }
  }

  /**
   * Logout user from backend and clear local auth
   */
  async logout(device: string = 'web') {
    try {
      if (this.userId) {
        // Call backend logout if we have authentication
        const logoutData = {
          user_id: this.userId,
          device: device
        };

        await this.callApi('users', 'logout', logoutData);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with clearing local auth even if backend call fails
    } finally {
      // Always clear local authentication
      this.clearAuth();
    }
  }

  /**
   * Clear authentication
   */
  clearAuth() {
    this.userId = null;
    this.secret = null;

    if (typeof window !== 'undefined') {
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
    const url = `${this.api_domain}/${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add JWT if available
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;
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

export const login = (email: string, password: string, device?: string) => {
  return apiClient.login(email, password, device);
};

export const logout = (device?: string) => {
  return apiClient.logout(device);
};

export const setApiAuth = (userId: string, secret: string) => {
  return apiClient.setAuth(userId, secret);
};

export const setSession = (userId: string, sessionSecret: string) => {
  return apiClient.setSession(userId, sessionSecret);
};

export const clearApiAuth = () => {
  return apiClient.clearAuth();
};

export const isApiAuthenticated = () => {
  return apiClient.isAuthenticated();
};

// QR Code API functions
export const generateQRCode = (campaignId: string) => {
  return callApi('qr_campaigns', 'generate', { campaignId });
};

export const validateQRCode = (uniqueId: string) => {
  return callApi('qr_usage', 'validate', { uniqueId });
};

export const markQRUsed = (uniqueId: string, customerId: string, playerInfo: any, pointsEarned: number = 0) => {
  return callApi('qr_usage', 'mark_used', {
    uniqueId,
    customerId,
    playerInfo,
    pointsEarned
  });
};

export const getQRCampaigns = (filters: Record<string, unknown> = {}) => {
  return callApi('qr_campaigns', 'list', filters);
};

export const createQRCampaign = (campaignData: any) => {
  return callApi('qr_campaigns', 'create', campaignData);
};

export const updateQRCampaign = (campaignId: string, campaignData: any) => {
  return callApi('qr_campaigns', 'update', { id: campaignId, ...campaignData });
};

export const deleteQRCampaign = (campaignId: string) => {
  return callApi('qr_campaigns', 'delete', { id: campaignId });
};

export const getQRCampaign = (campaignId: string) => {
  return callApi('qr_campaigns', 'read', { id: campaignId });
};

export const checkQRStatus = (uniqueId: string) => {
  return callApi('qr_usage', 'check_status', { uniqueId });
};

// Customer functions for QR flow
export const upsertCustomer = (customerData: any) => {
  return callApi('profile_customer', 'upsert', customerData);
};

export const findCustomerByPhone = (phone: string, merchantId: string) => {
  return callApi('profile_customer', 'find_by_phone', { phone, merchant_id: merchantId });
};

// Games catalog functions
export const getMerchantGames = () => {
  // merchant_games gets merchant_id from authentication session, not from data
  return callApi('merchant_games', 'list', {});
};

export const getGameDetails = (gameId: string) => {
  return callApi('games_catalog', 'read', { id: gameId });
};

// Public API functions for QR validation and customer operations
// These use callApi but bypass authentication for public endpoints

/**
 * Public QR validation - no auth required
 */
export const publicValidateQRCode = async (uniqueId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1'}/qr-validate.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uniqueId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Public QR validation error:', error);
    throw error;
  }
};

/**
 * Public customer find by phone - no auth required
 */
export const publicFindCustomerByPhone = async (phone: string, merchantId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1'}/customer-find-by-phone-public.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        merchantId: merchantId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Public customer find error:', error);
    throw error;
  }
};

/**
 * Public customer upsert - no auth required
 */
export const publicUpsertCustomer = async (customerData: {
  merchantId: string;
  name: string;
  phone: string;
  email?: string;
  instagram?: string;
}) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1'}/customer-upsert-public.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Public customer upsert error:', error);
    throw error;
  }
};

/**
 * Public QR code mark as used - no auth required
 */
export const publicMarkQRUsed = async (data: {
  uniqueId: string;
  customerId: string;
  playerInfo: {
    name: string;
    phone: string;
    email?: string;
    instagram?: string;
  };
  pointsEarned?: number;
}) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1'}/qr-mark-used.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Public QR mark used error:', error);
    throw error;
  }
};

/**
 * Public QR status check - no auth required
 */
export const publicCheckQRStatus = async (uniqueId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1'}/qr-check-status.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uniqueId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Public QR status check error:', error);
    throw error;
  }
};
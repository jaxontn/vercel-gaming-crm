'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { callApi } from '@/lib/api-client';
import { Loader2, User, Phone, Mail, Instagram, AlertCircle, Gamepad2 } from 'lucide-react';

interface RegistrationData {
  name: string;
  phone: string;
  email: string;
  instagram: string;
}

interface QRData {
  gameId: string;
  gameName: string;
  icon: string;
  merchantId: string;
  campaignId: string;
}

export default function QRRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    phone: '',
    email: '',
    instagram: ''
  });

  useEffect(() => {
    const validateQR = async () => {
      try {
        const response = await callApi('POST', '/qr_usage/validate', {
          uniqueId: params.uniqueId
        });

        if (response.status === 'SUCCESS' && response.data?.valid) {
          setQrData(response.data);
        } else {
          setError(response.message || 'Invalid QR code');
        }
      } catch (err) {
        console.error('QR validation error:', err);
        setError('Failed to validate QR code. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.uniqueId) {
      validateQR();
    }
  }, [params.uniqueId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      setError('Name and phone number are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // First, find or create the customer
      const customerResponse = await callApi('POST', '/customers/find_by_phone', {
        phone: formData.phone,
        merchantId: qrData?.merchantId
      });

      let customerId: string;

      if (customerResponse.status === 'SUCCESS' && customerResponse.data) {
        // Customer exists
        customerId = customerResponse.data.id;
      } else {
        // Create new customer
        const createResponse = await callApi('POST', '/customers/upsert', {
          merchantId: qrData?.merchantId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email || '',
          instagram: formData.instagram || ''
        });

        if (createResponse.status !== 'SUCCESS') {
          throw new Error(createResponse.message || 'Failed to create customer');
        }
        customerId = createResponse.data.id;
      }

      // Store customer info in localStorage for the game
      localStorage.setItem('customerInfo', JSON.stringify({
        id: customerId,
        ...formData
      }));

      // Redirect to the game page
      router.push(`/play/${qrData?.merchantId}?qrCode=${params.uniqueId}`);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Loading game information...</p>
        </div>
      </div>
    );
  }

  if (error && !qrData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const gameIcons: Record<string, string> = {
    'gift_slot_machine': '🎰',
    'rewards_treasure_hunt': '🏴‍☠️',
    'scratch_card': '🎫',
    'lucky_spin': '🎡',
    'quiz_master': '🧠',
    'memory_match': '🎮',
    'word_puzzle': '📝',
    'number_guess': '🔢'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
            {qrData?.icon ? (
              <span className="text-4xl">{gameIcons[qrData.icon] || '🎮'}</span>
            ) : (
              <Gamepad2 className="h-10 w-10 text-purple-200" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join to Play!</h1>
          <p className="text-purple-200">Enter your details to start playing</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-300 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+60 12-345 6789"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Instagram Username
            </label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="@yourusername"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold py-4 px-6 flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                Start Playing
                <Gamepad2 className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-purple-200 text-xs mt-6">
          By registering, you agree to participate in this game and allow us to contact you about rewards.
        </p>
      </div>
    </div>
  );
}
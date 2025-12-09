'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { callApi } from '@/lib/api-client';
import { Loader2, QrCode, Gamepad2, ArrowRight } from 'lucide-react';

interface ValidationResponse {
  valid: boolean;
  merchantId: string;
  gameId: string;
  gameCode: string;
  gameName: string;
  icon: string;
  qrUsageId: string;
  campaignId: string;
}

export default function QRValidationPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<ValidationResponse | null>(null);

  useEffect(() => {
    const validateQR = async () => {
      try {
        setIsLoading(true);
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

  const handleProceedToGame = () => {
    if (qrData) {
      // Redirect to registration page first
      router.push(`/play/qr-register/${params.uniqueId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Validating QR code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center">
          <QrCode className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">QR Code Error</h1>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => window.close()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!qrData) {
    return null;
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
            {qrData.icon ? (
              <span className="text-4xl">{gameIcons[qrData.icon] || '🎮'}</span>
            ) : (
              <Gamepad2 className="h-10 w-10 text-purple-200" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Ready to Play!</h1>
          <p className="text-purple-200">You've unlocked a special game</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">{qrData.gameName}</h2>
          <p className="text-purple-200 text-sm mb-4">
            Scan successful! Get ready for an exciting gaming experience.
          </p>
          <div className="space-y-2 text-sm text-purple-200">
            <p>• Play to earn rewards</p>
            <p>• Track your score</p>
            <p>• Win exciting prizes</p>
          </div>
        </div>

        <button
          onClick={handleProceedToGame}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold py-4 px-6 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
        >
          Continue to Game
          <ArrowRight className="h-5 w-5" />
        </button>

        <p className="text-center text-purple-200 text-xs mt-4">
          By continuing, you agree to provide your information to participate in the game.
        </p>
      </div>
    </div>
  );
}
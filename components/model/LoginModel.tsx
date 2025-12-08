'use client';

import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, Phone, X } from "lucide-react";
import Link from "next/link";
import { getCartApi } from "@/api-endpoints/CartsApi";
import { postSendSmsOtpUserApi, postVerifySmsOtpApi } from "@/api-endpoints/authendication";
import { baseUrl } from "@/api-endpoints/ApiUrls";

function LoginModal({ open, handleClose, vendorId }: any) {
  if (!open) return null;

  const [activeTab, setActiveTab] = useState<'email' | 'otp'>('otp');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      setLoading(true);
      const response: any = await axios.post(
        `${baseUrl}/user_login/`,
        { ...formData, vendor_id: vendorId }
      );

      if (response) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userId', response?.data?.user_id);
        }

        const updateApi = await getCartApi(`user/${response?.data?.user_id}`);
        if (updateApi?.data?.length > 0) {
          localStorage.setItem('cartId', updateApi.data[0].id);
        }

        handleClose();
        window.location.reload();
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    if (!mobile) return setError('Mobile number is required');
    setLoading(true);
    try {
      const res = await postSendSmsOtpUserApi({ contact_number: mobile, vendor_id: vendorId });
      if (res?.data?.token) {
        setOtpSent(true);
        setToken(res.data.token);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await postVerifySmsOtpApi({
        otp,
        token,
        login_type: "user",
        vendor_id: vendorId,
      });

      const userId = res?.data?.user_id;
      if (userId) {
        localStorage.setItem('userId', userId);
        const cartRes = await getCartApi(`user/${userId}`);
        if (cartRes?.data?.length > 0) {
          localStorage.setItem('cartId', cartRes.data[0].id);
        }
        handleClose();
        window.location.reload();
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-[95%] max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Sign in to your account</h2>
          <X onClick={handleClose} className="text-gray-500 hover:text-red-500 cursor-pointer" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
            <button
            onClick={() => setActiveTab('otp')}
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'otp' ? 'border--green-900 text--green-900' : 'text-gray-600 border-transparent'}`}
          >
            OTP Login
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'email' ? 'border--green-900 text--green-900' : 'text-gray-600 border-transparent'}`}
          >
            Email Login
          </button>
        </div>

        {activeTab === 'email' ? (
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="pl-10 pr-4 py-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:border--green-900 focus:ring--green-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={passwordShow ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-10 py-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:border--green-900 focus:ring--green-900 focus:outline-none"
                />
                {passwordShow ? (
                  <EyeOff onClick={() => setPasswordShow(false)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                ) : (
                  <Eye onClick={() => setPasswordShow(true)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                )}
              </div>
            </div>

            <div className="text-right text-sm">
              <Link href="/auth/forgot-password" className="text--green-900 hover:underline">
                Forgot your password?
              </Link>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-900 text-white py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
               <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                className="pl-10 pr-4 py-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:border--green-900 focus:ring--green-900 focus:outline-none"
              />
              </div>
            </div>

            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-900 transition"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="mt-1 w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-900 transition"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </>
            )}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>
        )}

        <p className="text-sm text-gray-600 text-center mt-6">
          Don’t have an account?{' '}
          <Link href="/signup" className="text--green-900 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;

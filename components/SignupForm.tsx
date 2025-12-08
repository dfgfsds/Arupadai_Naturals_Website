'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Loader } from 'lucide-react';
import { useVendor } from '@/context/VendorContext';
import { postCreateUserAPi } from '@/api-endpoints/authendication';
import { postCartCreateApi } from '@/api-endpoints/CartsApi';
import { useRouter } from 'next/router';

const SignupForm = () => {
  const { vendorId } = useVendor();
  const router = useRouter();
  const [error, setError] = useState('');
  const imageUrl =
    'https://img.freepik.com/free-vector/smiling-young-man-hoodie_1308-176157.jpg?t=st=1742883789~exp=1742887389~hmac=276a954f79d559893475b0e8f8b90da7f45a713cad804b0a8a3e57668378105b&w=740';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 🔹 Restrict mobile input to max 10 digits only
    if (name === 'mobile' && value.length > 10) return;

    // 🔹 Live validation for email & mobile
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({
        ...prev,
        email: emailRegex.test(value) ? '' : 'Enter a valid email address',
      }));
    }

    if (name === 'mobile') {
      setErrors((prev) => ({
        ...prev,
        mobile:
          value.length === 0
            ? 'Mobile is required'
            : value.length < 10
            ? 'Mobile number must be 10 digits'
            : '',
      }));
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name !== 'email' && name !== 'mobile') {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      name: formData?.name ? '' : 'Name is required',
      email: formData?.email
        ? emailRegex.test(formData.email)
          ? ''
          : 'Enter a valid email address'
        : 'Email is required',
      mobile: formData?.mobile
        ? formData.mobile.length === 10
          ? ''
          : 'Mobile number must be 10 digits'
        : 'Mobile is required',
      password: formData?.password ? '' : 'Password is required',
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg !== '');
    if (hasError) {
      setLoading(false);
      return;
    }

    const payload = {
      name: formData?.name,
      email: formData?.email,
      password: formData?.password,
      contact_number: formData?.mobile,
      vendor: vendorId,
      created_by: formData?.name,
      profile_image: imageUrl,
    };

    try {
      const response = await postCreateUserAPi(payload);
      if (response) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('userId', response?.data?.user?.id);
          localStorage.setItem('userName', response?.data?.user?.name);
        }

        const updateApi = await postCartCreateApi('', {
          user: response?.data?.user?.id,
          vendor: vendorId,
          created_by: response?.data?.user?.name,
        });

        if (updateApi) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('cartId', updateApi?.data?.id);
            window.location.href = '/';
          }
        }
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          'Something went wrong, please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text--green-900 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring--green-900'
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring--green-900'
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile"
              maxLength={10} // 🔹 Prevent typing more than 10 digits
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.mobile
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring--green-900'
              }`}
            />
            {errors.mobile && (
              <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring--green-900'
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-900 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin w-4 h-4" />
                Creating...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Already have an account */}
          <p className="text-sm text-center mt-3">
            Already have an account?{' '}
            <Link href="/login" className="text-green-900 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;

'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { API_URL } from '../../../config';
import { useRouter } from 'next/navigation';

export default function RegisterPetugasPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    repeatPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.repeatPassword) {
      setError('Password tidak cocok');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: 'operator'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mendaftarkan petugas');
      }

      if (data.success) {
        router.push('/dashboard/petugas');
        router.refresh();
      } else {
        throw new Error(data.message || 'Gagal mendaftarkan petugas');
      }
    } catch (err) {
      console.error('Error registering staff:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mendaftarkan petugas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 bg-[#00D1C5] rounded-t-lg">
            <h2 className="text-xl font-semibold text-white">Register Petugas</h2>
            <p className="text-white/80 text-sm">Buat akun petugas</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 max-w-2xl">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D1C5] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="yourusername"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D1C5] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D1C5] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Repeat Password
                </label>
                <input
                  type="password"
                  id="repeatPassword"
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D1C5] focus:border-transparent"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-[#00D1C5] text-white rounded-md hover:bg-[#00bfb4] text-sm font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'REGISTER'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
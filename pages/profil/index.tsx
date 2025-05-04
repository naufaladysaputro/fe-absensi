import React, { useState } from 'react';
import Layout from '../../components/Layout';

interface ProfileFormData {
  namaLengkap: string;
  email: string;
  passwordLama: string;
  passwordBaru: string;
  konfirmasiPassword: string;
}

const ProfilPage = () => {
  // Dummy data untuk user yang sedang login
  const [formData, setFormData] = useState<ProfileFormData>({
    namaLengkap: 'John Doe', // Ini akan diisi dengan data user yang login
    email: 'john.doe@example.com', // Ini akan diisi dengan data user yang login
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi password baru dan konfirmasi password
    if (formData.passwordBaru !== formData.konfirmasiPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }

    // TODO: Implement API call to update profile
    console.log('Form submitted:', formData);
    
    // Reset password fields
    setFormData(prev => ({
      ...prev,
      passwordLama: '',
      passwordBaru: '',
      konfirmasiPassword: ''
    }));

    alert('Profil berhasil diperbarui!');
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">PROFIL SAYA</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="namaLengkap"
              name="namaLengkap"
              required
              value={formData.namaLengkap}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan email"
            />
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Ubah Password</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="passwordLama" className="block text-sm font-medium text-gray-700 mb-1">
                  Password Lama
                </label>
                <input
                  type="password"
                  id="passwordLama"
                  name="passwordLama"
                  value={formData.passwordLama}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Masukkan password lama"
                />
              </div>

              <div>
                <label htmlFor="passwordBaru" className="block text-sm font-medium text-gray-700 mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  id="passwordBaru"
                  name="passwordBaru"
                  value={formData.passwordBaru}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Masukkan password baru"
                />
              </div>

              <div>
                <label htmlFor="konfirmasiPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  id="konfirmasiPassword"
                  name="konfirmasiPassword"
                  value={formData.konfirmasiPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Masukkan ulang password baru"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProfilPage; 
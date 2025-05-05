import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../config'; // Pastikan API_URL sudah didefinisikan dengan benar di config.js atau config.ts

const PengaturanPage = () => {
  // State untuk form input
  const [schoolName, setSchoolName] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const token = Cookies.get('access_token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/settings`, { headers });
        const settings = response.data.data;
        setSchoolName(settings.nama_sekolah);
        setSchoolYear(settings.tahun_ajaran);
        setLogoPreview(`${API_URL}${settings.logo_path}`); // Misal logo_url di response
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);


  // Fungsi untuk menangani submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('school_name', schoolName);
    formData.append('school_year', schoolYear);

    try {
      const response = await axios.put(`${API_URL}/api/settings/1`, formData, { headers });


      if (response.data.success) {
        alert('Pengaturan berhasil diperbarui');
      } else {
        alert('Gagal memperbarui pengaturan');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Terjadi kesalahan saat memperbarui pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (logo) {
      const formDataLogo = new FormData();
      formDataLogo.append('logo', logo);

      // for (let [key, value] of formDataLogo.entries()) {
      //   console.log(`${key}:`, value);
      // }

      try {
        const response = await axios.put(`${API_URL}/api/settings/logo/1`, formDataLogo, {
          headers: {
            Authorization: `Bearer ${token}`,
            // Jangan tambahkan Content-Type manual
          } 
        });

        if (response.data.success) {
          alert('Pengaturan berhasil diperbarui');
        } else {
          alert('Gagal memperbarui pengaturan');
        }
      } catch (error) {
        console.error('Error updating settings:', error);
        alert('Terjadi kesalahan saat memperbarui pengaturan');
      } finally {
        setLoading(false);
      }
    }
  };

  // Fungsi untuk menangani perubahan file logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Form Pengaturan */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Pengaturan Sekolah</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="school_name" className="block text-sm font-medium text-gray-700 mb-2">Nama Sekolah</label>
              <input
                type="text"
                id="school_name"
                className="w-full border rounded-md pl-3 pr-10 py-2"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="school_year" className="block text-sm font-medium text-gray-700 mb-2">Tahun Ajaran</label>
              <input
                type="text"
                id="school_year"
                className="w-full border rounded-md pl-3 pr-10 py-2"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Simpan Pengaturan'}
            </button>
          </form>
        </div>

        {/* Right Side - Logo Upload */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Logo Sekolah</h2>
          <form onSubmit={handleSubmitLogo}>
            <div className="mb-4">
              <div style={{ marginBottom: '10px', border: '1px solid #eee', padding: '10px' }}>
                <img src={logoPreview} alt="Logo Preview" className="max-w-xs mx-auto" />
              </div>
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif, image/svg+xml"
                onChange={handleLogoChange}
                className="w-full"
              />
              <span className="text-sm text-secondary">(.png, .jpg, .jpeg, .gif, .svg)</span>

              <button
                type="submit"
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Simpan Gambar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PengaturanPage;

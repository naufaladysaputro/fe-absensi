import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config'; // Pastikan API_URL sudah didefinisikan dengan benar di config.js atau config.ts
import Cookies from 'js-cookie';
import { FiPrinter, FiFileText } from 'react-icons/fi';
import Layout from '../../components/Layout';

const LaporanAbsensi = () => {
  const [date, setDate] = useState('');
  const [kelas, setKelas] = useState('');
  const [loading, setLoading] = useState(false);
  const [kelasOptions, setKelasOptions] = useState<any[]>([]); // State untuk menyimpan data kelas
  const [siswaCount, setSiswaCount] = useState<any>({}); // Menyimpan jumlah siswa untuk masing-masing kelas

  const token = Cookies.get('access_token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Mengambil data kelas dari API saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/classes`, { headers });
        if (response.data.status === 'success') {
          setKelasOptions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching kelas data:', error);
      }
    };
    fetchKelas();
  }, []); // Kosong array dependencies untuk fetch data sekali saja

  const handleGenerateReport = async (format: string) => {
    try {
      setLoading(true);
      const [year, month] = date.split('-');
      const formattedMonth = parseInt(month, 10); // Menghapus angka nol jika bulan seperti "01" menjadi 1

      // Meminta laporan absensi dari API
      const response = await axios.get(
        `${API_URL}/api/reports/attendance?month=${formattedMonth}&year=${year}&classId=${kelas}&format=${format}`,
        { headers }
      );

      if (response.data.success) {
        const fileUrl = response.data.url; // Mengambil URL dari respons API
        const fullUrl = `${API_URL}${fileUrl}`; // Membuat URL lengkap (tergantung pada server Anda, bisa berbeda)
        window.open(fullUrl, '_blank');// Menghapus elemen <a> setelah digunakan
      } else {
        console.error('Laporan gagal dihasilkan');
      }

    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Menghitung jumlah siswa berdasarkan kelas
  const calculateSiswaCount = () => {
    const count: any = {};
    kelasOptions.forEach((kelasData) => {
      count[kelasData.id] = Math.floor(Math.random() * 10); // Anggap random siswa count, ganti sesuai data asli
    });
    setSiswaCount(count);
  };

  // Panggil calculateSiswaCount jika kelasOptions berubah
  useEffect(() => {
    if (kelasOptions.length > 0) {
      calculateSiswaCount();
    }
  }, [kelasOptions]);

  return (
    <Layout>
      <div className="px-6 py-4">
        <div className="card rounded-lg shadow-lg">
          <div className="card-header bg-blue-500 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold">Generate Laporan</h4>
                <p className="text-sm">Laporan Absen</p>
              </div>
            </div>
          </div>

          <div className="card-body p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Laporan Absen Siswa */}
              <div className="card">
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col p-6">
                  <h4 className="text-primary text-xl font-bold mb-4">Laporan Absen Siswa</h4>

                  {/* Input untuk memilih bulan */}
                  <div className="mb-4 flex items-center space-x-3">
                    <span className="font-medium">Bulan:</span>
                    <input
                      type="month"
                      name="tanggalSiswa"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="border rounded-md px-3 py-2"
                    />
                  </div>

                  {/* Select untuk memilih kelas */}
                  <select
                    name="kelas"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="border rounded-md p-2 mt-3"
                  >
                    <option value="">--Pilih kelas--</option>
                    {kelasOptions.map((kelasData) => (
                      <option key={kelasData.id} value={kelasData.id}>
                        {`Kelas ${kelasData.nama_kelas} ${kelasData.selection.nama_rombel}`}
                      </option>
                    ))}
                  </select>

                  {/* Tombol untuk menghasilkan laporan dalam format PDF dan DOC */}
                  <div className="mt-6 flex flex-col space-y-4">
                    <button
                      type="button"
                      onClick={() => handleGenerateReport('pdf')}
                      className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                      disabled={loading}
                    >
                      <FiPrinter size={24} className="mr-2" />
                      <span className="text-lg font-semibold">Generate PDF</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LaporanAbsensi;

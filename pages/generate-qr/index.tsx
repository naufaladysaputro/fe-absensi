import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config'; // Pastikan API_URL sudah didefinisikan dengan benar di config.js atau config.ts
import Cookies from 'js-cookie';
import { FiPrinter } from 'react-icons/fi';
import Layout from '../../components/Layout';
import { BiQrScan } from 'react-icons/bi';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const GeneratePage = () => {
  const [kelas, setKelas] = useState('');
  const [loading, setLoading] = useState(false);
  const [kelasOptions, setKelasOptions] = useState<any[]>([]); // State untuk menyimpan data kelas
  const [siswaCount, setSiswaCount] = useState<any>({}); // Menyimpan jumlah siswa untuk masing-masing kelas

  const token = Cookies.get('access_token');
  const headers = {
    // 'Content-Type': 'application/json',
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

  const handleGenerateQR = async () => {
    try {
      setLoading(true);
      // Meminta laporan absensi dari API
      const response = await axios.post(`${API_URL}/api/qrcodes/generate/class/${kelas}`, {}, { headers });

      if (response.data.status) {
        alert(response.data.message);

      } else {
        alert(response.data.message);
        console.error('Laporan gagal dihasilkan');
      }

    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      // Meminta laporan absensi dari API
      const response = await axios.get(
        `${API_URL}/api/qrcodes/class/${kelas}`,
        { headers }
      );

      if (response.data.status === "success") {
        const zip = new JSZip();
        const folder = zip.folder(`QR_Kelas_${kelas}`);

        const qrList = response.data.data;
        console.log('====================================');
        console.log(qrList);
        console.log('====================================');
        for (const item of qrList) {
          const fileUrl = `${API_URL}${item.qr_path}`;
          const fileName = item.qr_path.split('/').pop() || 'qr.png';

          try {
            const fileResponse = await axios.get(fileUrl, {
              responseType: 'blob',
              headers,
            });

            folder?.file(fileName, fileResponse.data);
          } catch (err) {
            console.warn(`❌ File gagal diunduh dan dilewati: ${fileUrl}`);
            continue; // skip file yang error
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `QR_Kelas_${kelas}.zip`);
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
                <h4 className="text-xl font-bold">Generate QR</h4>
                <p>Generate QR berdasarkan kode unik data siswa</p>
              </div>
            </div>
          </div>

          <div className="card-body p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Laporan Absen Siswa */}
              <div className="card">
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col p-6">
                  <h4 className="text-primary text-xl font-bold mb-4">Gernerate per kelas</h4>
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
                      onClick={() => handleGenerateQR()}
                      className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                      disabled={loading}
                    >
                      <BiQrScan size={24} className="mr-2" />
                      <span className="text-lg font-semibold">Generate Per Kelas</span>
                    </button>
                  </div>
                  <div className="mt-6 flex flex-col space-y-4">
                    <button
                      type="button"
                      onClick={() => handleDownload()}
                      className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                      disabled={loading}
                    >
                      <FiPrinter size={24} className="mr-2" />
                      <span className="text-lg font-semibold">Download per kelas</span>
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

export default GeneratePage;

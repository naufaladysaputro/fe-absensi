import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config'; // Pastikan API_URL sudah didefinisikan dengan benar di config.js atau config.ts
import Cookies from 'js-cookie';
import Layout from '../../components/Layout';
import Swal from "sweetalert2";

const AttendanceList = () => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [kelas, setKelas] = useState('');
  const [kelasOptions, setKelasOptions] = useState<any[]>([]); // State untuk menyimpan data kelas

  const [attendanceData, setAttendanceData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    kehadiran: '',
    keterangan: ''
  });
  const token = Cookies.get('access_token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (date && kelas) {
      fetchAttendance();
    }
  }, [date, kelas]);

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


  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/attendance/class/${kelas}?date=${date}`, { headers });
      setAttendanceData(response.data.data.attendance);
    } catch (error) {
      console.error('Gagal mengambil data kehadiran:', error);
    }
  };

  const handleEditClick = (attendance) => {
    setEditingId(attendance.id);
    setFormData({
      kehadiran: attendance.kehadiran || '',
      keterangan: attendance.keterangan || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    fetchAttendance()
  };

  const handleSave = async (id:any) => {
    try {
      await axios.put(`${API_URL}/api/attendance/update-by-date`, { ...formData, tanggal: date, students_id: id }, { headers });
      setEditingId(null);
      Swal.fire('Berhasil', 'Data berhasil diperbarui', 'success');
      
      fetchAttendance(); // Refresh data
    } catch (error:any) {
      Swal.fire({
        icon: 'error',
        title: 'Edit Gagal',
        text: error.response.data.message,
        confirmButtonColor: '#d33',
      });
      console.error('Gagal menyimpan perubahan:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ kehadiran: '', keterangan: '' });
  };

  return (
    <Layout>
      <div className="p-4 p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">Daftar Kehadiran</h2>

      <div className="card-body p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Laporan Absen Siswa */}
          <div className="card">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col p-6">

              {/* Input untuk memilih bulan */}
              <div className="mb-4 flex items-center space-x-3">
                <span className="font-medium">Tanggal:</span>
                <input
                  type="date"
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
            </form>
          </div>
        </div>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Kehadiran</th>
            <th className="border px-4 py-2">Jam Masuk</th>
            <th className="border px-4 py-2">Jam Pulang</th>
            <th className="border px-4 py-2">Keterangan</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
          <tbody>
            {attendanceData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Tidak ada data kehadiran
                </td>
              </tr>
            ) : (
              attendanceData.map((attendance, index) => (
                <tr key={attendance.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{attendance.nama_siswa}</td>
                  <td className="border px-4 py-2">
                    {editingId === attendance.id ? (
                      <select
                        name="kehadiran"
                        value={formData.kehadiran}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      >
                        <option value="">Pilih</option>
                        <option value="Hadir">Hadir</option>
                        <option value="Izin">Izin</option>
                        <option value="Sakit">Sakit</option>
                        <option value="Alpha">Alpha</option>
                      </select>
                    ) : (
                      attendance.attendance.kehadiran
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {attendance.attendance.jam_masuk || '-'}
                  </td>
                  <td className="border px-4 py-2">
                    {attendance.attendance.jam_pulang || '-'}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === attendance.id ? (
                      <input
                        type="text"
                        name="keterangan"
                        value={formData.keterangan}
                        onChange={handleInputChange}
                        className="border px-2 py-1 w-full"
                      />
                    ) : (
                      attendance.attendance.keterangan || '-'
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingId === attendance.id ? (
                      <>
                        <button
                          onClick={() => handleSave(attendance.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditClick(attendance)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

      </table>
    </div>
    </Layout>
  );
};

export default AttendanceList;

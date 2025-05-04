import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Layout from '../../components/Layout';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { API_URL } from '../config';

interface Student {
  id: number;
  nama_siswa: string;
  nis: string;
  class: {
    nama_kelas: string;
  };
  selection: {
    nama_rombel: string;
  };
}

interface ClassOption {
  id: number;
  nama_kelas: string;
}

const SiswaPage = () => {
  const [siswaData, setSiswaData] = useState<Student[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nama_siswa: '',
    nis: '',
    classes_id: ''
  });

  const token = Cookies.get('access_token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  // Ambil data siswa dan kelas saat load
  useEffect(() => {
    fetchSiswa();
    fetchClasses();
  }, []);

  const fetchSiswa = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/students`, { headers });
      if (response.data.status === 'success') {
        const formattedData = response.data.data.map((student: any) => ({
          id: student.id,
          nama_siswa: student.nama_siswa,
          nis: student.nis,
          class: student.class,
          selection: student.selection
        }));
        setSiswaData(formattedData);
      }
    } catch (error) {
      console.error('Gagal mengambil data siswa:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/classes`, { headers });
      if (response.data.status === 'success') {
        setClassOptions(response.data.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data kelas:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedStudentId !== null) {
        await axios.put(`${API_URL}/api/students/${selectedStudentId}`, formData, { headers });
      } else {
        await axios.post(`${API_URL}/api/students`, formData, { headers });
      }

      closeModal();
      fetchSiswa();
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
    }
  };

  const handleEdit = (student: Student) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setSelectedStudentId(student.id);
    setFormData({
      nama_siswa: student.nama_siswa,
      nis: student.nis,
      classes_id: '' // Atur sesuai kebutuhan jika ID kelas tersedia
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus siswa ini?')) return;
    try {
      await axios.delete(`${API_URL}/api/students/${id}`, { headers });
      fetchSiswa();
    } catch (error) {
      console.error('Gagal menghapus siswa:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedStudentId(null);
    setFormData({
      nama_siswa: '',
      nis: '',
      classes_id: ''
    });
  };

  const filteredSiswa = siswaData.filter((siswa) =>
    siswa.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 bg-white rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Data Siswa</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Tambah Siswa
          </button>
        </div>

        {/* Modal Tambah/Edit Siswa */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {isEditMode ? 'Edit Siswa' : 'Tambah Siswa'}
                </h2>
                <button onClick={closeModal}>
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label>Nama Siswa</label>
                  <input
                    type="text"
                    name="nama_siswa"
                    value={formData.nama_siswa}
                    onChange={handleInputChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label>NIS</label>
                  <input
                    type="text"
                    name="nis"
                    value={formData.nis}
                    onChange={handleInputChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label>Kelas</label>
                  <select
                    name="classes_id"
                    value={formData.classes_id}
                    onChange={handleInputChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Pilih Kelas</option>
                    {classOptions.map((kelas) => (
                      <option key={kelas.id} value={kelas.id}>
                        {kelas.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {isEditMode ? 'Simpan Perubahan' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filter dan Tabel */}
        <div className="flex justify-between mb-4">
          <div>
            <label className="mr-2">Show</label>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-1 rounded"
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">No</th>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">NIS</th>
                <th className="p-2 border">Kelas</th>
                <th className="p-2 border">Rombel</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((siswa, index) => (
                  <tr key={siswa.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{siswa.nama_siswa}</td>
                    <td className="p-2 border">{siswa.nis}</td>
                    <td className="p-2 border">{siswa.class?.nama_kelas || '-'}</td>
                    <td className="p-2 border">{siswa.selection?.nama_rombel || '-'}</td>
                    <td className="p-2 border">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(siswa)}
                          className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(siswa.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SiswaPage;

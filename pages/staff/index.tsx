import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import axios from 'axios';
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import { API_URL } from '../../config';

interface Staff {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  role: string;
}

const StaffPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
    role: 'guru'
  });

  const token = Cookies.get('access_token');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`, { headers });
      const filtered = response.data.data
        .filter((user: any) => user.role === 'admin' || user.role === 'guru')
        .map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role.toUpperCase()
        }));
      setStaffData(filtered);
    } catch (error) {
      console.error('Gagal memuat data staff:', error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

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
      let response
      if (isEditMode && selectedStaff) {
        response = await axios.put(
          `${API_URL}/api/users/${selectedStaff.id}`,
          {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            repeatPassword: formData.repeatPassword,
            role: formData.role
          },
          { headers }
        );

        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: response.data.message || 'Data staff berhasil diperbarui.',
          confirmButtonColor: '#3085d6',
        });
      } else {
        response = await axios.post(
          `${API_URL}/api/auth/register`,
          {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            repeatPassword: formData.repeatPassword,
            role: formData.role
          },
          { headers }
        );

        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: response.data.message || 'Data staff berhasil diperbarui.',
          confirmButtonColor: '#3085d6',
        });
      }

      handleModalClose();
      fetchStaff();
    } catch (error: any) {

      const errorMessage = error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.';
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });

      console.error('Gagal menyimpan data:', error);
    }
  };

  const handleEdit = (staff: Staff) => {
    setIsEditMode(true);
    setSelectedStaff(staff);
    setFormData({
      username: staff.username,
      email: staff.email,
      password: '',
      repeatPassword: '',
      role: staff.role.toLowerCase()
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus staff ini?')) return;
    try {
      let response = await axios.delete(`${API_URL}/api/users/${id}`, { headers });
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: response.data.message || 'Staff berhasil dihapus.',
        confirmButtonColor: '#3085d6',
      });
      fetchStaff();
    } catch (error: any) {

      const errorMessage = error?.response?.data?.message || 'Terjadi kesalahan saat menghapus data.';

      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
      console.error('Gagal menghapus data:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedStaff(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      role: 'guru'
    });
  };

  const filteredStaff = staffData.filter(staff =>
    staff.username.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Data Role</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FiPlus className="mr-2" />
            Tambah Baru
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditMode ? 'Edit Data Staff' : 'Tambah Staff Baru'}
                </h2>
                <button
                  onClick={handleModalClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Masukkan username"
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

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required={!isEditMode}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Masukkan password"
                  />
                </div>

                <div>
                  <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Ulangi Password
                  </label>
                  <input
                    type="password"
                    id="repeatPassword"
                    name="repeatPassword"
                    required={!isEditMode}
                    value={formData.repeatPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Ulangi password"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    role
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="guru">Guru</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isEditMode ? 'Simpan Perubahan' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <span className="mr-2">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="ml-2">entries</span>
          </div>

          <div className="flex items-center w-full sm:w-auto">
            <span className="mr-2">Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-1 w-full sm:w-auto"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">No</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Username</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Email</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Role</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((staff, index) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 border-b whitespace-nowrap">{index + 1}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 border-b whitespace-nowrap">{staff.username}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 border-b whitespace-nowrap">{staff.email}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 border-b whitespace-nowrap">{staff.role}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm border-b">
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded-md flex items-center justify-center"
                        >
                          <FiEdit2 className="mr-1" size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(staff.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded-md flex items-center justify-center">
                          <FiTrash2 className="mr-1" size={14} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing 1 to {staffData.length} of {staffData.length} entries
          </div>
          <div className="flex space-x-1">
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded">
              1
            </button>
            <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffPage; 
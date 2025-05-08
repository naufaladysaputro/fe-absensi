import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { API_URL } from '../config';

interface Class {
  id: number;
  nama_kelas: string;
  selection_id: number;
}

interface Selection {
  id: number;
  nama_rombel: string;
}

interface FormData {
  nama_kelas: string;
  selections_id: number;
}

interface FormDataSelection {
  nama_rombel: string;
}

const ClassPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSelection, setSelectedSelection] = useState<Selection | null>(null);
  const [classData, setClassData] = useState<Class[]>([]);
  const [selectionData, setSelectionData] = useState<Selection[]>([]);
  const [formData, setFormData] = useState<FormData>({
    nama_kelas: '',
    selections_id: 0,
  });

  const [formDataSelection, setFormDataSelection] = useState<FormDataSelection>({
    nama_rombel: '',
  });

  const [loading, setLoading] = useState(true);

  const token = Cookies.get('access_token');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Fetch classes and selections
  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/classes`, { headers });
      setClassData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelections = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/selections`, { headers });
      setSelectionData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch selections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSelections();
  }, []);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Class Submit
  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if (isEditMode && selectedClass) {
        response = await axios.put(
          `${API_URL}/api/classes/${selectedClass.id}`,
          {
            nama_kelas: formData.nama_kelas,
            selections_id: formData.selections_id,
          },
          { headers }
        );
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message || 'Class data updated successfully.',
          confirmButtonColor: '#3085d6',
        });
      } else {
        response = await axios.post(
          `${API_URL}/api/classes`,
          {
            nama_kelas: formData.nama_kelas,
            selections_id: formData.selections_id,
          },
          { headers }
        );
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message || 'Class added successfully.',
          confirmButtonColor: '#3085d6',
        });
      }

      handleModalClose();
      fetchClasses();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'An error occurred while saving data.';
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
      console.error('Failed to save data:', error);
    }
  };

  // Handle Selection Submit
  const handleSelectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if (isEditMode && selectedSelection) {
        response = await axios.put(
          `${API_URL}/api/selections/${selectedSelection.id}`,
          { nama_rombel: formDataSelection.nama_rombel },
          { headers }
        );
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message || 'Selection updated successfully.',
          confirmButtonColor: '#3085d6',
        });
      } else {
        response = await axios.post(
          `${API_URL}/api/selections`,
          { nama_rombel: formDataSelection.nama_rombel },
          { headers }
        );
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message || 'Selection added successfully.',
          confirmButtonColor: '#3085d6',
        });
      }

      handleSelectionModalClose();
      fetchSelections();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'An error occurred while saving data.';
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
      console.error('Failed to save data:', error);
    }
  };

  // Handle Edit for Class
  const handleEditClass = (classItem: Class) => {
    setIsEditMode(true);
    setSelectedClass(classItem);
    setFormData({
      nama_kelas: classItem.nama_kelas,
      selections_id: classItem.selection_id,
    });
    setIsClassModalOpen(true);
  };

  // Handle Edit for Selection
  const handleEditSelection = (selectionItem: Selection) => {
    setIsEditMode(true);
    setSelectedSelection(selectionItem);
    setFormDataSelection({
      nama_rombel: selectionItem.nama_rombel,
    });
    setIsSelectionModalOpen(true);
  };

  // Handle Delete for Class
  const handleDeleteClass = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      const response = await axios.delete(`${API_URL}/api/classes/${id}`, {
        headers,
      });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message || 'Class deleted successfully.',
        confirmButtonColor: '#3085d6',
      });
      fetchClasses();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'An error occurred while deleting data.';
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
      console.error('Failed to delete data:', error);
    }
  };

  // Handle Delete for Selection
  const handleDeleteSelection = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this selection?')) return;
    try {
      const response = await axios.delete(`${API_URL}/api/selections/${id}`, {
        headers,
      });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message || 'Selection deleted successfully.',
        confirmButtonColor: '#3085d6',
      });
      fetchSelections();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'An error occurred while deleting data.';
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
      console.error('Failed to delete data:', error);
    }
  };

  // Close Modals
  const handleClassModalClose = () => {
    setIsClassModalOpen(false);
    setIsEditMode(false);
    setSelectedClass(null);
    setFormData({
      nama_kelas: '',
      selections_id: 0,
    });
  };

  const handleSelectionModalClose = () => {
    setIsSelectionModalOpen(false);
    setIsEditMode(false);
    setSelectedSelection(null);
    setFormData({
      nama_kelas: '',
      selections_id: 0,
    });
  };

  // Filtering classes
  const filteredClasses = classData.filter((classItem) =>
    classItem
  );

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Class Data</h1>
        </div>

        {/* Class Modal */}
        {isClassModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditMode ? 'Edit Class Data' : 'Add New Class'}
                </h2>
                <button
                  onClick={handleClassModalClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleClassSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Class Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter class name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="selection_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Selection
                  </label>
                  <select
                    id="selection_id"
                    name="selection_id"
                    required
                    value={formData.selection_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={0} disabled>
                      Select a Selection
                    </option>
                    {selections.map((selection) => (
                      <option key={selection.id} value={selection.id}>
                        {selection.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleClassModalClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isEditMode ? 'Save Changes' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Selection Modal */}
        {isSelectionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditMode ? 'Edit Selection' : 'Add New Selection'}
                </h2>
                <button
                  onClick={handleSelectionModalClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSelectionSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Selection Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formDataSelection.nama_rombel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter selection name"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleSelectionModalClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isEditMode ? 'Save Changes' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="flex space-x-6">
          <div className="flex-1 pl-6">

            {/* Classes Table */}
            <div className="overflow-x-auto mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Classes</h2>
              <button
                onClick={() => setIsClassModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FiPlus className="mr-2" />
                Add New Class
              </button>
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">No</th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Class Name</th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Selection</th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">Loading...</td>
                    </tr>
                  ) : (
                    filteredClasses.map((classItem, index) => (
                      <tr key={classItem.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-800 border-b">{index + 1}</td>
                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-800 border-b">{classItem.nama_kelas}</td>
                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-800 border-b">
                          {classItem.selection.nama_rombel || 'No Selection'
                          }
                        </td>
                        <td className="px-4 py-2 text-xs sm:text-sm border-b">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClass(classItem)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                            >
                              <FiEdit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClass(classItem.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                            >
                              <FiTrash2 size={14} />
                              Delete
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

          <div className="flex-1 pl-6">

            {/* Selections Table */}
            <div className="overflow-x-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Selections</h2>
              <button
                onClick={() => setIsSelectionModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FiPlus className="mr-2" />
                Add New Selection
              </button>
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">No</th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Selection Name</th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">Loading...</td>
                    </tr>
                  ) : (
                    selectionData.map((selection, index) => (
                      <tr key={selection.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-800 border-b">{index + 1}</td>
                        <td className="px-4 py-2 text-xs sm:text-sm text-gray-800 border-b">{selection.nama_rombel}</td>
                        <td className="px-4 py-2 text-xs sm:text-sm border-b">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditSelection(selection)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                            >
                              <FiEdit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSelection(selection.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                            >
                              <FiTrash2 size={14} />
                              Delete
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
        </div>
      </div>
    </Layout>
  );
};

export default ClassPage;


import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { FiEye, FiPrinter } from 'react-icons/fi';

interface AbsensiRecord {
  id: number;
  kelas: string;
  tanggal: string;
}

const RiwayatAbsensiPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  
  // Dummy data for demonstration
  const absensiData: AbsensiRecord[] = [
    { id: 1, kelas: 'KELAS 1', tanggal: '2024-03-20' },
    { id: 2, kelas: 'KELAS 2', tanggal: '2024-03-20' },
    { id: 3, kelas: 'KELAS 1', tanggal: '2024-03-19' },
    { id: 4, kelas: 'KELAS 2', tanggal: '2024-03-19' },
  ];

  const handleView = (id: number) => {
    // Handle view action
    console.log('View record:', id);
  };

  const handlePrint = (id: number) => {
    // Handle print action
    console.log('Print record:', id);
  };

  return (
    <Layout>
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">
            DATA REKAP ABSENSI BERDASARKAN LOKASI
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          {/* Entries per page selector */}
          <div className="flex items-center w-full sm:w-auto">
            <span className="text-sm mr-2">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm ml-2">entries</span>
          </div>

          {/* Search input */}
          <div className="flex items-center w-full sm:w-auto">
            <span className="text-sm mr-2">Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-1 w-full sm:w-auto text-sm"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Table with horizontal scroll on small screens */}
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">No</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Kelas</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Tanggal</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {absensiData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 border-b whitespace-nowrap">{record.id}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 border-b whitespace-nowrap">{record.kelas}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 border-b whitespace-nowrap">
                      {new Date(record.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm border-b">
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleView(record.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-md flex items-center justify-center"
                        >
                          <FiEye className="mr-1" size={12} />
                          <span className="text-xs sm:text-sm">Lihat</span>
                        </button>
                        <button
                          onClick={() => handlePrint(record.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded-md flex items-center justify-center"
                        >
                          <FiPrinter className="mr-1" size={12} />
                          <span className="text-xs sm:text-sm">Print</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing 1 to {absensiData.length} of {absensiData.length} entries
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

export default RiwayatAbsensiPage; 
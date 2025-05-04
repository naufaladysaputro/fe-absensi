import React, { useState, useRef } from 'react';
import Layout from '../../components/Layout';
import { QRCodeSVG } from 'qrcode.react';
import { FiSearch, FiPrinter } from 'react-icons/fi';

interface Student {
  id: string;
  nama: string;
  nisn: string;
  kelas: string;
  jabatan: string;
  shift: string;
  penempatan: string;
}

const GenerateQRPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Dummy data for demonstration
  const dummyStudent: Student = {
    id: 'S2008001',
    nama: 'Karyawan 1',
    nisn: '1234567890',
    kelas: 'VII A',
    jabatan: 'STAFF',
    shift: 'SHIFT 1',
    penempatan: 'KELAS 1'
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would make an API call to search for the student
    // For now, we'll just set the dummy data
    setSelectedStudent(dummyStudent);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      const printContents = printContent.innerHTML;
      
      // Create a new window with only the QR code content
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Print QR Code</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                }
                .print-container {
                  max-width: 400px;
                  margin: 0 auto;
                  text-align: center;
                }
                .qr-code {
                  background: white;
                  padding: 20px;
                  margin-bottom: 20px;
                  display: inline-block;
                }
                .info {
                  text-align: left;
                  margin-top: 20px;
                }
                .info p {
                  margin: 5px 0;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                  .print-container {
                    max-width: none;
                  }
                }
              </style>
            </head>
            <body>
              <div class="print-container">
                ${printContents}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        
        // Wait for images to load before printing
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Search Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">GENERATE QRCODE</h2>
          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                INPUT NAMA DI SINI
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border rounded-md pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama..."
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right Side - QR Code Display */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">INFORMASI QRCODE AKAN MUNCUL DISINI</h2>
          
          {selectedStudent ? (
            <>
              <div ref={printRef} className="bg-blue-500 text-white rounded-lg p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg qr-code">
                    <QRCodeSVG
                      value={selectedStudent.id}
                      size={200}
                      level="H"
                      includeMargin={true}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2 info">
                  <p className="text-lg font-bold">{selectedStudent.id}</p>
                  <p>{selectedStudent.nama}</p>
                  <div className="space-y-1 text-sm">
                    <p>NAMA JABATAN : {selectedStudent.jabatan}</p>
                    <p>SHIFT : {selectedStudent.shift}</p>
                    <p>PENEMPATAN : {selectedStudent.penempatan}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handlePrint}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md flex items-center"
                >
                  <FiPrinter className="mr-2" />
                  Cetak QR Code
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <p>QR Code akan muncul setelah melakukan pencarian</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GenerateQRPage; 
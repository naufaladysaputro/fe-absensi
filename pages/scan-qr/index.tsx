import React, { useState, useCallback, useRef, useEffect } from 'react';
import Layout from '../../components/Layout';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { API_URL } from '../config'; // Pastikan API_URL sudah didefinisikan dengan benar di config.js atau config.ts

const ScanQRPage = () => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const webcamRef = useRef<Webcam>(null);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [qrResult, setQrResult] = useState<string | null>(null);

  const token = Cookies.get('access_token');
  const headers = {
    // 'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  // Mendapatkan daftar kamera yang tersedia
  const getCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting cameras:', error);
    }
  }, [selectedCamera]);

  // Panggil saat komponen dimuat
  useEffect(() => {
    getCameras();
  }, [getCameras]);

  // Konfigurasi kamera
  const videoConstraints = {
    width: 640,
    height: 480,
    deviceId: selectedCamera,
    facingMode: 'environment'
  };

  // Error saat akses kamera gagal
  const handleUserMediaError = (error: string | DOMException) => {
    console.error('Webcam error:', error);
    setIsCameraActive(false);
  };

  // Proses pembacaan QR code dari frame video
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 // Video ready
      ) {
        const video = webcamRef.current.video as HTMLVideoElement;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);
          if (code) {
            setQrResult(code.data);
            Swal.fire({
              icon: 'success',
              title: 'QR Code Terdeteksi!',
              text: `Isi: ${code.data}`,
              confirmButtonText: 'OK'
            });
            clearInterval(interval); // Stop scanning after success
          }
        }
      }
    }, 500); // Cek setiap 500ms

    return () => clearInterval(interval);
  }, []);

  const handleMasuk = async () => {
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
  
    const handlePulang = async () => {
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
  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">SCAN QR CODE</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Pilihan Kamera */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Kamera:
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
            >
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* Tampilan Kamera */}
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            {isCameraActive && (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full"
                onUserMediaError={handleUserMediaError}
              />
            )}
          </div>

          {!isCameraActive && (
            <div className="text-center py-8">
              <p className="text-red-500">
                Kamera tidak dapat diakses. Mohon periksa izin kamera di browser.
              </p>
              <button
                onClick={() => setIsCameraActive(true)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Hasil Scan */}
          {qrResult && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded">
              <p><strong>QR Code:</strong> {qrResult}</p>
            </div>
          )}

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Arahkan kamera ke QR Code untuk melakukan scanning</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScanQRPage;

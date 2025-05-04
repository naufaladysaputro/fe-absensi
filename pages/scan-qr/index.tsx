import React, { useState, useCallback, useRef } from 'react';
import Layout from '../../components/Layout';
import Webcam from 'react-webcam';

const ScanQRPage = () => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const webcamRef = useRef<Webcam>(null);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

  // Get list of available cameras
  const getCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error: unknown) {
      console.error('Error getting cameras:', error);
    }
  }, [selectedCamera]);

  // Call getCameras when component mounts
  React.useEffect(() => {
    getCameras();
  }, [getCameras]);

  const videoConstraints = {
    width: 640,
    height: 480,
    deviceId: selectedCamera,
    facingMode: "user"
  };

  const handleUserMediaError = (error: string | DOMException) => {
    console.error('Webcam error:', error);
    setIsCameraActive(false);
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">SCAN QR CODE</h1>
        </div>

        <div className="max-w-2xl mx-auto">
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
                Camera tidak dapat diakses. Mohon periksa izin kamera pada browser Anda.
              </p>
              <button
                onClick={() => setIsCameraActive(true)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Coba Lagi
              </button>
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
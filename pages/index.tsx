'use client';

import Layout from '../components/Layout';
import StatsCards from '../components/StatsCards';
import AttendanceSummary from '../components/AttendanceSummary';
import { useState, useEffect } from 'react';
import { API_URL } from './config';
import axios from "axios";
import Cookies from "js-cookie";

type DashboardData = {
  success: boolean;
  data: {
    tanggal: string;
    siswa: {
      jumlah: number;
      absensi_hari_ini: {
        hadir: number;
        sakit: number;
        izin: number;
        alfa: number;
      };
      grafik_mingguan: Array<{
        tanggal: string;
        hadir: number;
      }>;
    };
    guru: {
      jumlah: number;
    };
    kelas: {
      jumlah: number;
    };
    petugas: {
      jumlah: number;
    };
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardData['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = Cookies.get('access_token');
        const response = await axios.get(`${API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

        // const data: DashboardData = await response.json();
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const LoadingState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500">Memuat data dashboard...</p>
      </div>
    </div>
  );

  const ErrorState = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Gagal memuat data</h3>
        <p className="text-sm text-gray-500">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Ringkasan data absensi sekolah
          </p>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : stats ? (
          <>
            <StatsCards stats={stats} />
            <AttendanceSummary stats={stats} />
          </>
        ) : null}
      </div>
    </Layout>
  );
}
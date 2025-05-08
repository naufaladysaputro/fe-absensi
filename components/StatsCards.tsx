import {
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../pages/config'; // Pastikan API_URL sudah didefinisikan dengan benar di config.js atau config.ts
import Cookies from 'js-cookie';

type StatCardProps = {
  title: string;
  value: number;
  subtitle?: string;
  bgColor: string;
  icon: React.ElementType;
};

const StatCard = ({ title, value, subtitle, bgColor, icon: Icon }: StatCardProps) => (
  <div className={`${bgColor} rounded-lg p-6`}>
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Icon className="h-8 w-8 text-white" aria-hidden="true" />
        <span className="text-4xl font-bold text-white">{value}</span>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        {subtitle && (
          <p className="text-xs text-white/80 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  </div>
);

export type DashboardStats = {
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
  kelas: {
    jumlah: number;
  };
  petugas: {
    jumlah: number;
  };
  guru: {
    jumlah: number;
  };
};

export default function StatsCards({ stats }: { stats: DashboardStats }) {
  const token = Cookies.get('access_token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const [schoolName, setSchoolName] = useState('');
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/settings`, { headers });
        const settings = response.data.data;
        setSchoolName(settings.nama_sekolah);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);
  const cards = [
    {
      title: 'Jumlah siswa',
      value: stats.siswa.jumlah,
      subtitle: 'Terdaftar',
      bgColor: 'bg-purple-500',
      icon: UserGroupIcon,
    },
    {
      title: 'Jumlah kelas',
      value: stats.kelas.jumlah,
      subtitle: schoolName,
      bgColor: 'bg-cyan-500',
      icon: AcademicCapIcon,
    },
    {
      title: 'Jumlah petugas',
      value: stats.petugas.jumlah,
      subtitle: 'Petugas dan Administrator',
      bgColor: 'bg-red-500',
      icon: UsersIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => (
        <StatCard key={idx} {...card} />
      ))}
    </div>
  );
}
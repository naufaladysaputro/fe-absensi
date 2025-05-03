import {
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

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
  const cards = [
    {
      title: 'Jumlah siswa',
      value: stats.siswa.jumlah,
      subtitle: 'Terdaftar',
      bgColor: 'bg-purple-500',
      icon: UserGroupIcon,
    },
    {
      title: 'Jumlah guru',
      value: stats.guru?.jumlah || 1,
      subtitle: 'Terdaftar',
      bgColor: 'bg-green-500',
      icon: UsersIcon,
    },
    {
      title: 'Jumlah kelas',
      value: stats.kelas.jumlah,
      subtitle: 'SMPN 3 KALIATI',
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <StatCard key={idx} {...card} />
      ))}
    </div>
  );
}
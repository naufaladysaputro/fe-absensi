import { DashboardStats } from './StatsCards';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type AttendanceStatus = {
  title: string;
  value: number;
  bgColor: string;
  textColor: string;
};

const AttendanceSection = ({
  title,
  date,
  stats
}: {
  title: string;
  date: string;
  stats: AttendanceStatus[]
}) => (
  <div className="rounded-lg bg-white p-6 shadow">
    <div className="border-b border-gray-100 pb-4">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{date}</p>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-4">
      {stats.map((status) => (
        <div
          key={status.title}
          className={`rounded-lg ${status.bgColor} px-4 py-2`}
        >
          <div className="flex items-center justify-between">
            <div className={`text-sm font-medium ${status.textColor}`}>
              {status.title}
            </div>
            <div className={`text-2xl font-semibold ${status.textColor}`}>
              {status.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function AttendanceSummary({ stats }: { stats: DashboardStats }) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const today = formatDate(new Date());

  const studentAttendance: AttendanceStatus[] = [
    {
      title: 'Hadir',
      value: stats.siswa.absensi_hari_ini.hadir,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    {
      title: 'Sakit',
      value: stats.siswa.absensi_hari_ini.sakit,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
    {
      title: 'Izin',
      value: stats.siswa.absensi_hari_ini.izin,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    {
      title: 'Alfa',
      value: stats.siswa.absensi_hari_ini.alfa,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'area' as const,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: stats.siswa.grafik_mingguan.map(data =>
        new Date(data.tanggal).toLocaleDateString('id-ID', { weekday: 'short' })
      ),
    },
    yaxis: {
      labels: {
        formatter: (value: number) => Math.round(value).toString(),
      },
    },
    colors: ['#9333EA', '#22C55E'], // Purple for students, Green for teachers
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    legend: {
      show: true,
      position: 'top',
    },
  };

  const chartSeries = [
    {
      name: 'Kehadiran Siswa',
      data: stats.siswa.grafik_mingguan.map(data => data.hadir),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-1">
        <AttendanceSection
          title="Absensi Siswa Hari Ini"
          date={today}
          stats={studentAttendance}
        />
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-base font-semibold text-gray-900">
          Grafik Kehadiran Mingguan
        </h2>
        <div className="mt-4">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={250}
          />
        </div>
      </div>
    </div>
  );
}
import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  QrCodeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Absensi Siswa', href: '/dashboard/absensi-siswa', icon: ClipboardDocumentListIcon },
  { name: 'Data Siswa', href: '/dashboard/siswa', icon: UserGroupIcon },
  { name: 'Data Kelas & RomBel', href: '/dashboard/kelas', icon: AcademicCapIcon },
  { name: 'Generate QR Code', href: '/dashboard/qrcode', icon: QrCodeIcon },
  { name: 'Generate Laporan', href: '/dashboard/laporan', icon: DocumentTextIcon },
  { name: 'Data Petugas', href: '/dashboard/petugas', icon: UsersIcon },
  { name: 'Pengaturan', href: '/dashboard/pengaturan', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  return (
    <div className="flex grow flex-col overflow-y-auto bg-[#1a1a1a] px-8">
      <div className="flex h-24 shrink-0 items-center border-b border-white/10">
        <div className="flex flex-col text-white">
          <span className="text-xl font-bold tracking-wide">OPERATOR</span>
          <span className="text-sm font-medium text-white/70">PETUGAS ABSENSI</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-x-4 rounded-lg p-3 text-[15px] font-medium text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
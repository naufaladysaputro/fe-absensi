import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiCheck, FiUsers, FiBookOpen, FiCalendar, FiCamera, FiCode, FiClock, FiLogOut, FiUser, FiChevronDown, FiMenu, FiX, FiSettings, FiPrinter } from 'react-icons/fi';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_URL } from '../config';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [role, setRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const fetchVerify = async (token: any) => {

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
    try {
      const response = await axios.get(`${API_URL}/api/auth/verify`, { headers });
      console.log('====================================');
      console.log(response.data.user);
      setRole(response.data.user.role)
      setUsername(response.data.user.username)
      console.log('====================================');
    } catch (error) {
      console.error('Error verifying token:', error);
      handleLogout(); // bisa logout jika token tidak valid
    }

  };

  useEffect(() => {
    const token = Cookies.get('access_token');
    const verifyAndSet = async () => {
      if (!token) {
        handleLogout();
        return;
      }

      await fetchVerify(token);
    };

    verifyAndSet();

    // Initial time set
    setCurrentTime(formatTime(new Date()));

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);

    // Close sidebar when route changes (mobile)
    const handleRouteChange = () => {
      setIsSidebarOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      clearInterval(timer);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta'
    }).format(date);
  };

  let menuItems
  if (role == 'admin') {
    menuItems = [
      { icon: FiHome, label: 'Dashboard', path: '/' },
      { icon: FiUsers, label: 'Data Staff', path: '/staff' },
      { icon: FiCheck, label: 'Absen Siswa', path: '/absen' },
      { icon: FiBookOpen, label: 'Data Siswa', path: '/siswa' },
      { icon: FiCalendar, label: 'Data Kelas', path: '/kelas' },
      { icon: FiCode, label: 'Ambil QR Code', path: '/generate-qr' },
      { icon: FiCamera, label: 'Scan QR Code', path: '/scan-qr' },
      { icon: FiPrinter, label: 'Generate Laporan', path: '/laporan' },
      { icon: FiSettings, label: 'Pengaturan', path: '/pengaturan' },
    ];
  } else {
    menuItems = [
      { icon: FiHome, label: 'Dashboard', path: '/' },
      // { icon: FiUsers, label: 'Data Staff', path: '/staff' },
      { icon: FiCheck, label: 'Absen Siswa', path: '/absen' },
      // { icon: FiBookOpen, label: 'Data Siswa', path: '/siswa' },
      // { icon: FiCalendar, label: 'Data Kelas', path: '/kelas' },
      // { icon: FiCode, label: 'Ambil QR Code', path: '/generate-qr' },
      { icon: FiCamera, label: 'Scan QR Code', path: '/scan-qr' },
      { icon: FiPrinter, label: 'Generate Laporan', path: '/laporan' },
      // { icon: FiSettings, label: 'Pengaturan', path: '/pengaturan' },
    ];
  }
  const handleLogout = () => {
    Cookies.remove('access_token');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        w-64 bg-white dark:bg-gray-800 shadow-lg z-30`}>
        <div className="p-4 bg-blue-600 dark:bg-blue-700 flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Sistem Absensi</h1>
          <button
            className="lg:hidden text-white hover:text-gray-200"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 ${router.pathname === item.path ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''
                  }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex justify-between items-center px-4 lg:px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <FiMenu size={24} />
              </button>
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">Welcome, {username}</h2>
              {/* Add suppressHydrationWarning and only show time when it's available */}
              <span suppressHydrationWarning className="hidden md:inline text-gray-600 dark:text-gray-300">
                {currentTime}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="hidden sm:inline">{username}</span>
                  <FiChevronDown className="w-4 h-4" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>

      {/* Dark Mode Toggle Button */}
      {/* <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleToggleDarkMode}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 focus:outline-none"
        >
          Toggle Dark Mode
        </button>
      </div> */}
    </div>
  );
};

export default Layout;

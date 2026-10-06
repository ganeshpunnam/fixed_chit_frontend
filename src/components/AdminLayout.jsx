import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function AdminLayout() {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/admin', label: 'Dashboard', exact: true, icon: HomeIcon },
    { to: '/admin/users', label: 'Users', icon: UsersIcon },
    { to: '/admin/schemes', label: 'Schemes', icon: BanknotesIcon },
    { to: '/admin/installments', label: 'Installments', icon: CurrencyDollarIcon },
    { to: '/admin/prize', label: 'Prize Allot', icon: TrophyIcon },
    { to: '/admin/reports', label: 'Reports', icon: ChartBarIcon },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      isActive
        ? 'bg-black text-yellow-400 font-semibold shadow-md'
        : 'text-gray-800 hover:bg-black hover:text-yellow-400 hover:shadow-md'
    }`;

  return (
    <div className="min-h-screen bg-yellow-400 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-black text-yellow-400 p-4 flex justify-between items-center shadow-lg sticky top-0 z-30">
        <div className="flex items-center gap-2">
          {/* Hamburger button on mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-1 mr-1 text-yellow-400 hover:bg-gray-900 rounded-lg transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <BanknotesIcon className="h-8 w-8" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider">CHIT FUND ADMIN</h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-yellow-300 font-medium transition-colors text-sm sm:text-base"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </nav>

      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-yellow-300 p-6 space-y-1 shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center mb-6 border-b border-yellow-400 pb-4">
            <span className="text-lg font-bold text-black tracking-wide">Menu</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-yellow-400 rounded-lg text-black transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setIsSidebarOpen(false)}
                className={linkClass}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </aside>

        {/* Desktop Sidebar */}
        <aside className="w-64 bg-yellow-300 p-6 space-y-1 shadow-xl min-h-screen hidden md:block">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.exact} className={linkClass}>
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 bg-yellow-400 overflow-x-hidden w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  TruckIcon, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Flower2
} from 'lucide-react';

interface SidebarProps {
  isMobile: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, setMobileMenuOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/productos', label: 'Productos', icon: <ShoppingBag size={20} /> },
    { path: '/inventario', label: 'Inventario', icon: <ClipboardList size={20} /> },
    { path: '/proveedores', label: 'Proveedores', icon: <TruckIcon size={20} /> },
    { path: '/reportes', label: 'Reportes', icon: <BarChart3 size={20} /> },
    { path: '/configuracion', label: 'Configuración', icon: <Settings size={20} /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <aside 
      className={`bg-white h-full shadow-md flex flex-col ${
        isMobile ? 'fixed inset-0 z-50' : 'sticky top-0 w-64 h-screen'
      }`}
    >
      {isMobile && (
        <div className="flex justify-end p-4">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <X size={24} />
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
        <Flower2 className="text-secondary-500" size={30} />
        <div>
          <h1 className="text-lg font-bold text-primary-600">Floristería</h1>
          <h2 className="text-sm text-secondary-500">Encanto</h2>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
                onClick={() => isMobile && setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="px-6 py-4 border-t border-neutral-100">
        <div className="text-xs text-neutral-500">
          &copy; 2025 Floristería Encanto
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import { Bell, Sun, Moon, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'appearance'>('notifications');
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('comfortable');
  const [notifications, setNotifications] = useState({
    lowStock: true,
    inventory: true,
    updates: false
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      // Save to localStorage
      localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      toast.success('Configuración de notificaciones actualizada');
      return newSettings;
    });
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
    toast.success('Tema actualizado');
  };

  const handleDensityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDensity = e.target.value;
    setDensity(newDensity);
    localStorage.setItem('contentDensity', newDensity);
    document.body.dataset.density = newDensity;
    toast.success('Densidad de contenido actualizada');
  };

  // Load saved settings on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedDensity = localStorage.getItem('contentDensity') || 'comfortable';
    const savedNotifications = JSON.parse(localStorage.getItem('notificationSettings') || 'null');

    setTheme(savedTheme);
    setDensity(savedDensity);
    if (savedNotifications) {
      setNotifications(savedNotifications);
    }
  }, []);

  return (
    <div className="page-transition">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              <button
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} />
                <span>Notificaciones</span>
              </button>
              
              <button
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'appearance'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('appearance')}
              >
                <Sun size={18} />
                <span>Apariencia</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="card">
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Preferencias de Notificaciones</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                    <div>
                      <h3 className="font-medium">Alertas de Stock Bajo</h3>
                      <p className="text-sm text-neutral-500">Recibe notificaciones cuando los productos alcancen el nivel mínimo de stock</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.lowStock}
                        onChange={() => handleNotificationChange('lowStock')}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                    <div>
                      <h3 className="font-medium">Movimientos de Inventario</h3>
                      <p className="text-sm text-neutral-500">Notificaciones sobre entradas y salidas significativas de inventario</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.inventory}
                        onChange={() => handleNotificationChange('inventory')}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                    <div>
                      <h3 className="font-medium">Actualizaciones del Sistema</h3>
                      <p className="text-sm text-neutral-500">Recibe notificaciones sobre nuevas características y actualizaciones</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.updates}
                        onChange={() => handleNotificationChange('updates')}
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Apariencia</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tema</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 ${
                          theme === 'light' 
                            ? 'border-primary-500 bg-white' 
                            : 'border-neutral-200 hover:border-primary-500 bg-white'
                        }`}
                        onClick={() => handleThemeChange('light')}
                      >
                        <Sun size={24} className={theme === 'light' ? 'text-primary-500' : 'text-neutral-500'} />
                        <span className="text-sm font-medium">Claro</span>
                      </button>
                      
                      <button 
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 ${
                          theme === 'dark' 
                            ? 'border-primary-500 bg-white' 
                            : 'border-neutral-200 hover:border-primary-500 bg-white'
                        }`}
                        onClick={() => handleThemeChange('dark')}
                      >
                        <Moon size={24} className={theme === 'dark' ? 'text-primary-500' : 'text-neutral-500'} />
                        <span className="text-sm font-medium">Oscuro</span>
                      </button>
                      
                      <button 
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 ${
                          theme === 'system' 
                            ? 'border-primary-500 bg-white' 
                            : 'border-neutral-200 hover:border-primary-500 bg-white'
                        }`}
                        onClick={() => handleThemeChange('system')}
                      >
                        <Globe size={24} className={theme === 'system' ? 'text-primary-500' : 'text-neutral-500'} />
                        <span className="text-sm font-medium">Sistema</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Densidad de Contenido</h3>
                    <select 
                      className="select"
                      value={density}
                      onChange={handleDensityChange}
                    >
                      <option value="comfortable">Cómoda</option>
                      <option value="compact">Compacta</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
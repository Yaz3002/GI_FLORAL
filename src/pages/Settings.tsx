import React, { useState } from 'react';
import { Bell, Sun, Moon, Monitor, Palette, Layout } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'appearance'>('notifications');
  const { theme, density, currentTheme, setTheme, setDensity } = useTheme();
  
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

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast.success(`Tema cambiado a ${newTheme === 'light' ? 'claro' : newTheme === 'dark' ? 'oscuro' : 'sistema'}`);
  };

  const handleDensityChange = (newDensity: 'comfortable' | 'compact') => {
    setDensity(newDensity);
    toast.success(`Densidad cambiada a ${newDensity === 'comfortable' ? 'cómoda' : 'compacta'}`);
  };

  // Load saved settings on mount
  React.useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('notificationSettings') || 'null');
    if (savedNotifications) {
      setNotifications(savedNotifications);
    }
  }, []);

  const themeOptions = [
    {
      value: 'light',
      label: 'Claro',
      icon: Sun,
      description: 'Tema claro para uso diurno'
    },
    {
      value: 'dark',
      label: 'Oscuro',
      icon: Moon,
      description: 'Tema oscuro para reducir fatiga visual'
    },
    {
      value: 'system',
      label: 'Sistema',
      icon: Monitor,
      description: 'Sigue la configuración del sistema'
    }
  ];

  const densityOptions = [
    {
      value: 'comfortable',
      label: 'Cómoda',
      description: 'Más espaciado, ideal para pantallas grandes'
    },
    {
      value: 'compact',
      label: 'Compacta',
      description: 'Menos espaciado, ideal para pantallas pequeñas'
    }
  ];

  return (
    <div className="page-transition">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              <button
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} />
                <span>Notificaciones</span>
              </button>
              
              <button
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'appearance'
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700'
                }`}
                onClick={() => setActiveTab('appearance')}
              >
                <Palette size={18} />
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
                  <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                      <h3 className="font-medium">Alertas de Stock Bajo</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Recibe notificaciones cuando los productos alcancen el nivel mínimo de stock
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.lowStock}
                        onChange={() => handleNotificationChange('lowStock')}
                      />
                      <div className="toggle-bg"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                      <h3 className="font-medium">Movimientos de Inventario</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Notificaciones sobre entradas y salidas significativas de inventario
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.inventory}
                        onChange={() => handleNotificationChange('inventory')}
                      />
                      <div className="toggle-bg"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                      <h3 className="font-medium">Actualizaciones del Sistema</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Recibe notificaciones sobre nuevas características y actualizaciones
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.updates}
                        onChange={() => handleNotificationChange('updates')}
                      />
                      <div className="toggle-bg"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Configuración de Apariencia</h2>
                
                <div className="space-y-8">
                  {/* Theme Selection */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sun className="w-5 h-5 text-primary-500" />
                      <h3 className="text-base font-medium">Tema de Color</h3>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      Selecciona el tema que prefieras para la interfaz
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {themeOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = theme === option.value;
                        
                        return (
                          <button
                            key={option.value}
                            className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600'
                            }`}
                            onClick={() => handleThemeChange(option.value as any)}
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div className={`p-3 rounded-full ${
                                isSelected 
                                  ? 'bg-primary-500 text-white' 
                                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                              }`}>
                                <Icon size={24} />
                              </div>
                              <div className="text-center">
                                <h4 className="font-medium">{option.label}</h4>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-3 h-3 bg-primary-500 rounded-full"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Current theme indicator */}
                    <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="font-medium">Tema actual:</span> {
                          currentTheme === 'light' ? 'Claro' : 'Oscuro'
                        }
                        {theme === 'system' && ' (detectado automáticamente)'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Density Selection */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Layout className="w-5 h-5 text-primary-500" />
                      <h3 className="text-base font-medium">Densidad de Contenido</h3>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      Ajusta el espaciado de los elementos en la interfaz
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {densityOptions.map((option) => {
                        const isSelected = density === option.value;
                        
                        return (
                          <button
                            key={option.value}
                            className={`relative p-4 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                              isSelected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600'
                            }`}
                            onClick={() => handleDensityChange(option.value as any)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 w-4 h-4 rounded-full border-2 ${
                                isSelected 
                                  ? 'border-primary-500 bg-primary-500' 
                                  : 'border-neutral-300 dark:border-neutral-600'
                              }`}>
                                {isSelected && (
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{option.label}</h4>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Preview Section */}
                  <div>
                    <h3 className="text-base font-medium mb-4">Vista Previa</h3>
                    <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Ejemplo de Tarjeta</h4>
                          <span className="badge badge-primary">Nuevo</span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Esta es una vista previa de cómo se verán los elementos con la configuración actual.
                        </p>
                        <div className="flex gap-2">
                          <button className="btn btn-primary btn-sm">Acción Principal</button>
                          <button className="btn btn-outline btn-sm">Acción Secundaria</button>
                        </div>
                      </div>
                    </div>
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
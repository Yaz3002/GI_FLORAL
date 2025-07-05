import React, { useState, useEffect } from 'react';
import { Bell, Sun, Moon, Globe, Type, Layout, Check, TestTube, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import toast from 'react-hot-toast';

// Tipos para las configuraciones
interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  contentDensity: 'compact' | 'comfortable' | 'spacious';
}

// Configuraciones por defecto
const defaultAppearanceSettings: AppearanceSettings = {
  theme: 'light',
  fontSize: 'medium',
  contentDensity: 'comfortable',
};

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { 
    settings: notificationSettings, 
    saveSettings: saveNotificationSettings,
    permission,
    isSupported,
    requestPermission,
    testNotification,
    getNotificationStatus
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState<'notifications' | 'appearance'>('notifications');
  
  // Estados para configuraciones
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings);
  
  // Estados para UI
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * Cargar configuraciones guardadas al montar el componente
   */
  useEffect(() => {
    loadSettings();
  }, [user]);

  /**
   * Aplicar configuraciones de apariencia al DOM
   */
  useEffect(() => {
    applyAppearanceSettings(appearanceSettings);
  }, [appearanceSettings]);

  /**
   * Cargar configuraciones desde localStorage
   */
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Cargar desde localStorage
      const savedAppearance = localStorage.getItem('appearanceSettings');
      
      if (savedAppearance) {
        setAppearanceSettings(JSON.parse(savedAppearance));
      }
      
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Error al cargar las configuraciones');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Guardar configuraciones en localStorage
   */
  const saveSettings = async () => {
    try {
      setIsLoading(true);
      
      // Guardar en localStorage
      localStorage.setItem('appearanceSettings', JSON.stringify(appearanceSettings));
      
      setHasUnsavedChanges(false);
      toast.success('Configuraciones guardadas exitosamente');
      
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar las configuraciones');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Aplicar configuraciones de apariencia al DOM
   */
  const applyAppearanceSettings = (settings: AppearanceSettings) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Aplicar tema
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.className = prefersDark ? 'dark' : 'light';
    } else {
      root.className = settings.theme;
    }
    
    // Aplicar tamaño de fuente
    body.setAttribute('data-font-size', settings.fontSize);
    
    // Aplicar densidad de contenido
    body.setAttribute('data-density', settings.contentDensity);
  };

  /**
   * Manejar cambios en configuraciones de notificaciones
   */
  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    const newSettings = { ...notificationSettings, [key]: !notificationSettings[key] };
    saveNotificationSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  /**
   * Manejar cambios en configuraciones de apariencia
   */
  const handleAppearanceChange = (key: keyof AppearanceSettings, value: any) => {
    setAppearanceSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      setHasUnsavedChanges(true);
      
      // Aplicar cambios inmediatamente
      applyAppearanceSettings(newSettings);
      
      // Feedback específico
      switch (key) {
        case 'theme':
          toast.success(`Tema cambiado a ${value === 'light' ? 'claro' : value === 'dark' ? 'oscuro' : 'sistema'}`);
          break;
        case 'fontSize':
          toast.success(`Tamaño de fuente: ${value === 'small' ? 'pequeño' : value === 'medium' ? 'mediano' : 'grande'}`);
          break;
        case 'contentDensity':
          toast.success(`Densidad: ${value === 'compact' ? 'compacta' : value === 'comfortable' ? 'cómoda' : 'espaciosa'}`);
          break;
      }
      
      return newSettings;
    });
  };

  /**
   * Restablecer configuraciones a valores por defecto
   */
  const resetToDefaults = () => {
    setAppearanceSettings(defaultAppearanceSettings);
    setHasUnsavedChanges(true);
    toast.success('Configuraciones restablecidas a valores por defecto');
  };

  /**
   * Solicitar permisos de notificación
   */
  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setHasUnsavedChanges(true);
    }
  };

  /**
   * Probar notificaciones
   */
  const handleTestNotification = async () => {
    await testNotification();
  };

  /**
   * Componente Toggle personalizado
   */
  const Toggle: React.FC<{
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    label: string;
    description?: string;
  }> = ({ checked, onChange, disabled = false, label, description }) => (
    <div className="flex items-center justify-between py-3 border-b border-neutral-200 last:border-b-0">
      <div className="flex-1">
        <h3 className="font-medium text-neutral-900">{label}</h3>
        {description && (
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div className={`w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer transition-all duration-200 ${
          checked ? 'peer-checked:bg-primary-500' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
      </label>
    </div>
  );

  /**
   * Componente para selector de opciones
   */
  const OptionSelector: React.FC<{
    options: { value: string; label: string; icon?: React.ReactNode }[];
    value: string;
    onChange: (value: string) => void;
    columns?: number;
  }> = ({ options, value, onChange, columns = 3 }) => (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
      {options.map(option => (
        <button 
          key={option.value}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
            value === option.value 
              ? 'border-primary-500 bg-primary-50 text-primary-700' 
              : 'border-neutral-200 hover:border-primary-300 bg-white hover:bg-primary-50'
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.icon && (
            <div className={`${value === option.value ? 'text-primary-500' : 'text-neutral-500'}`}>
              {option.icon}
            </div>
          )}
          <span className="text-sm font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );

  const notificationStatus = getNotificationStatus();

  if (isLoading) {
    return (
      <div className="page-transition">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2">Cargando configuraciones...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Configuración</h1>
        
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <button
              onClick={resetToDefaults}
              className="btn btn-outline btn-sm"
              disabled={isLoading}
            >
              Restablecer
            </button>
            <button
              onClick={saveSettings}
              className="btn btn-primary btn-sm flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Check size={16} />
              )}
              <span>Guardar Cambios</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de navegación */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} />
                <span>Notificaciones</span>
                {!notificationStatus.enabled && (
                  <div className="w-2 h-2 bg-warning-500 rounded-full ml-auto"></div>
                )}
              </button>
              
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'appearance'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
                onClick={() => setActiveTab('appearance')}
              >
                <Sun size={18} />
                <span>Apariencia</span>
                {hasUnsavedChanges && activeTab === 'appearance' && (
                  <div className="w-2 h-2 bg-warning-500 rounded-full ml-auto"></div>
                )}
              </button>
            </nav>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Módulo de Notificaciones */}
            {activeTab === 'notifications' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="text-primary-500" size={24} />
                  <h2 className="text-xl font-semibold">Configuración de Notificaciones</h2>
                </div>

                {/* Estado de las notificaciones */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                  <h3 className="font-medium mb-2">Estado del Sistema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isSupported ? 'bg-success-500' : 'bg-error-500'}`}></div>
                      <span>Soporte del navegador: {isSupported ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        permission === 'granted' ? 'bg-success-500' : 
                        permission === 'denied' ? 'bg-error-500' : 'bg-warning-500'
                      }`}></div>
                      <span>Permisos: {
                        permission === 'granted' ? 'Concedidos' : 
                        permission === 'denied' ? 'Denegados' : 'Pendientes'
                      }</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {permission !== 'granted' && (
                      <button
                        onClick={handleRequestPermission}
                        className="btn btn-primary btn-sm"
                        disabled={!isSupported}
                      >
                        Solicitar Permisos
                      </button>
                    )}
                    
                    <button
                      onClick={handleTestNotification}
                      className="btn btn-outline btn-sm flex items-center gap-1"
                      disabled={!notificationStatus.enabled}
                    >
                      <TestTube size={14} />
                      <span>Probar Notificación</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Notificaciones Push */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notificaciones Push</h3>
                    <div className="space-y-1">
                      <Toggle
                        checked={notificationSettings.pushNotifications}
                        onChange={() => handleNotificationChange('pushNotifications')}
                        disabled={!isSupported || permission === 'denied'}
                        label="Activar notificaciones push"
                        description="Recibe notificaciones en tiempo real en tu navegador"
                      />
                    </div>
                  </div>
                  
                  {/* Notificaciones de Eventos */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Eventos</h3>
                    <div className="space-y-1">
                      <Toggle
                        checked={notificationSettings.eventReminders}
                        onChange={() => handleNotificationChange('eventReminders')}
                        label="Recordatorios de eventos"
                        description="Notificaciones antes de que comiencen los eventos"
                      />
                      
                      <Toggle
                        checked={notificationSettings.eventUpdates}
                        onChange={() => handleNotificationChange('eventUpdates')}
                        label="Actualizaciones de eventos"
                        description="Notificaciones cuando los eventos sean modificados o cancelados"
                      />
                    </div>
                  </div>
                  
                  {/* Alertas del Sistema */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Alertas del Sistema</h3>
                    <div className="space-y-1">
                      <Toggle
                        checked={notificationSettings.lowStockAlerts}
                        onChange={() => handleNotificationChange('lowStockAlerts')}
                        label="Alertas de stock bajo"
                        description="Notificaciones cuando los productos alcancen el nivel mínimo de stock"
                      />
                      
                      <Toggle
                        checked={notificationSettings.inventoryMovements}
                        onChange={() => handleNotificationChange('inventoryMovements')}
                        label="Movimientos de inventario"
                        description="Notificaciones sobre entradas y salidas significativas de inventario"
                      />
                      
                      <Toggle
                        checked={notificationSettings.systemAlerts}
                        onChange={() => handleNotificationChange('systemAlerts')}
                        label="Alertas del sistema"
                        description="Notificaciones sobre actualizaciones y mantenimiento del sistema"
                      />
                    </div>
                  </div>
                  
                  {/* Configuraciones adicionales */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Configuraciones Adicionales</h3>
                    <div className="space-y-1">
                      <Toggle
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                        label="Notificaciones por email"
                        description="Recibe resúmenes diarios y alertas importantes por correo electrónico"
                      />
                      
                      <Toggle
                        checked={notificationSettings.soundEnabled}
                        onChange={() => handleNotificationChange('soundEnabled')}
                        label="Sonidos de notificación"
                        description="Reproducir sonidos cuando lleguen nuevas notificaciones"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Módulo de Apariencia */}
            {activeTab === 'appearance' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sun className="text-primary-500" size={24} />
                  <h2 className="text-xl font-semibold">Configuración de Apariencia</h2>
                </div>
                
                <div className="space-y-8">
                  {/* Selector de tema */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Tema</h3>
                    <OptionSelector
                      options={[
                        { value: 'light', label: 'Claro', icon: <Sun size={24} /> },
                        { value: 'dark', label: 'Oscuro', icon: <Moon size={24} /> },
                        { value: 'system', label: 'Sistema', icon: <Globe size={24} /> }
                      ]}
                      value={appearanceSettings.theme}
                      onChange={(value) => handleAppearanceChange('theme', value)}
                    />
                  </div>
                  
                  {/* Tamaño de fuente */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Tamaño de Fuente</h3>
                    <OptionSelector
                      options={[
                        { value: 'small', label: 'Pequeño', icon: <Type size={18} /> },
                        { value: 'medium', label: 'Mediano', icon: <Type size={22} /> },
                        { value: 'large', label: 'Grande', icon: <Type size={26} /> }
                      ]}
                      value={appearanceSettings.fontSize}
                      onChange={(value) => handleAppearanceChange('fontSize', value)}
                    />
                  </div>
                  
                  {/* Densidad de contenido */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Densidad de Contenido</h3>
                    <OptionSelector
                      options={[
                        { value: 'compact', label: 'Compacta', icon: <Layout size={20} /> },
                        { value: 'comfortable', label: 'Cómoda', icon: <Layout size={22} /> },
                        { value: 'spacious', label: 'Espaciosa', icon: <Layout size={24} /> }
                      ]}
                      value={appearanceSettings.contentDensity}
                      onChange={(value) => handleAppearanceChange('contentDensity', value)}
                    />
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
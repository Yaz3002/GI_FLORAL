import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

// Tipos para las configuraciones
export interface NotificationSettings {
  pushNotifications: boolean;
  lowStockAlerts: boolean;
  inventoryMovements: boolean;
  systemAlerts: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  colorScheme: 'default' | 'blue' | 'green' | 'purple';
  contentDensity: 'compact' | 'comfortable' | 'spacious';
  sidebarCollapsed: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
}

// Configuraciones por defecto
const defaultSettings: UserSettings = {
  notifications: {
    pushNotifications: true,
    lowStockAlerts: true,
    inventoryMovements: true,
    systemAlerts: false,
    emailNotifications: true,
    soundEnabled: true,
  },
  appearance: {
    theme: 'light',
    fontSize: 'medium',
    colorScheme: 'default',
    contentDensity: 'comfortable',
    sidebarCollapsed: false,
  },
};

/**
 * Hook personalizado para manejar configuraciones de usuario
 * Proporciona funcionalidades para cargar, guardar y aplicar configuraciones
 */
export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * Cargar configuraciones al montar el hook
   */
  useEffect(() => {
    loadSettings();
  }, [user]);

  /**
   * Aplicar configuraciones de apariencia cuando cambien
   */
  useEffect(() => {
    applyAppearanceSettings(settings.appearance);
  }, [settings.appearance]);

  /**
   * Cargar configuraciones desde localStorage y/o base de datos
   */
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Cargar desde localStorage como fallback
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
      
      // Si hay usuario autenticado, intentar cargar desde la base de datos
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_settings')
            .select('settings')
            .eq('user_id', user.id)
            .single();
          
          if (data && !error) {
            const dbSettings = { ...defaultSettings, ...data.settings };
            setSettings(dbSettings);
            // Sincronizar con localStorage
            localStorage.setItem('userSettings', JSON.stringify(dbSettings));
          }
        } catch (dbError) {
          console.log('No se encontraron configuraciones en la base de datos, usando localStorage');
        }
      }
      
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Error al cargar las configuraciones');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Guardar configuraciones en localStorage y base de datos
   */
  const saveSettings = async (newSettings?: UserSettings) => {
    const settingsToSave = newSettings || settings;
    
    try {
      setIsLoading(true);
      
      // Guardar en localStorage
      localStorage.setItem('userSettings', JSON.stringify(settingsToSave));
      
      // Si hay usuario autenticado, guardar en la base de datos
      if (user) {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            settings: settingsToSave,
            updated_at: new Date().toISOString(),
          });
        
        if (error) {
          console.error('Error saving to database:', error);
          // No mostrar error al usuario, localStorage funciona como fallback
        }
      }
      
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
  const applyAppearanceSettings = (appearanceSettings: AppearanceSettings) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Aplicar tema
    if (appearanceSettings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.className = prefersDark ? 'dark' : 'light';
    } else {
      root.className = appearanceSettings.theme;
    }
    
    // Aplicar configuraciones al body
    body.setAttribute('data-font-size', appearanceSettings.fontSize);
    body.setAttribute('data-color-scheme', appearanceSettings.colorScheme);
    body.setAttribute('data-density', appearanceSettings.contentDensity);
    body.setAttribute('data-sidebar-collapsed', appearanceSettings.sidebarCollapsed.toString());
  };

  /**
   * Actualizar configuraciones de notificaciones
   */
  const updateNotificationSettings = (updates: Partial<NotificationSettings>) => {
    const newSettings = {
      ...settings,
      notifications: { ...settings.notifications, ...updates }
    };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
    return newSettings;
  };

  /**
   * Actualizar configuraciones de apariencia
   */
  const updateAppearanceSettings = (updates: Partial<AppearanceSettings>) => {
    const newSettings = {
      ...settings,
      appearance: { ...settings.appearance, ...updates }
    };
    setSettings(newSettings);
    setHasUnsavedChanges(true);
    return newSettings;
  };

  /**
   * Restablecer configuraciones a valores por defecto
   */
  const resetToDefaults = () => {
    setSettings(defaultSettings);
    setHasUnsavedChanges(true);
    toast.success('Configuraciones restablecidas a valores por defecto');
  };

  /**
   * Verificar si las notificaciones push están soportadas
   */
  const isPushNotificationSupported = () => {
    return 'Notification' in window && 'serviceWorker' in navigator;
  };

  /**
   * Solicitar permisos para notificaciones push
   */
  const requestNotificationPermission = async () => {
    if (!isPushNotificationSupported()) {
      toast.error('Las notificaciones push no están soportadas en este navegador');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Permisos de notificación concedidos');
        return true;
      } else {
        toast.error('Permisos de notificación denegados');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Error al solicitar permisos de notificación');
      return false;
    }
  };

  return {
    settings,
    isLoading,
    hasUnsavedChanges,
    loadSettings,
    saveSettings,
    updateNotificationSettings,
    updateAppearanceSettings,
    resetToDefaults,
    isPushNotificationSupported,
    requestNotificationPermission,
  };
};
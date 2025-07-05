import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export interface NotificationSettings {
  pushNotifications: boolean;
  lowStockAlerts: boolean;
  inventoryMovements: boolean;
  systemAlerts: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  eventReminders: boolean;
  eventUpdates: boolean;
}

export interface EventNotification {
  id: string;
  type: 'event_reminder' | 'event_update' | 'event_cancelled' | 'event_starting';
  title: string;
  message: string;
  eventId: string;
  eventTitle: string;
  scheduledFor: Date;
  sent: boolean;
  createdAt: Date;
}

const defaultSettings: NotificationSettings = {
  pushNotifications: true,
  lowStockAlerts: true,
  inventoryMovements: true,
  systemAlerts: false,
  emailNotifications: true,
  soundEnabled: true,
  eventReminders: true,
  eventUpdates: true,
};

export const useNotifications = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [pendingNotifications, setPendingNotifications] = useState<EventNotification[]>([]);

  // Check browser support and permissions
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'Notification' in window && 'serviceWorker' in navigator;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
      }
    };

    checkSupport();
    loadSettings();
  }, [user]);

  // Load notification settings
  const loadSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem(`notificationSettings_${user?.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }, [user?.id]);

  // Save notification settings
  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    try {
      setSettings(newSettings);
      localStorage.setItem(`notificationSettings_${user?.id}`, JSON.stringify(newSettings));
      toast.success('Configuración de notificaciones guardada');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Error al guardar configuración');
    }
  }, [user?.id]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error('Las notificaciones no son compatibles con este navegador');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        toast.success('Permisos de notificación concedidos');
        return true;
      } else if (permission === 'denied') {
        toast.error('Permisos de notificación denegados');
        return false;
      } else {
        toast.warning('Permisos de notificación pendientes');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Error al solicitar permisos');
      return false;
    }
  }, [isSupported]);

  // Show browser notification
  const showNotification = useCallback(async (
    title: string, 
    options: NotificationOptions = {}
  ) => {
    if (!settings.pushNotifications || permission !== 'granted') {
      return;
    }

    try {
      // Play sound if enabled
      if (settings.soundEnabled) {
        playNotificationSound();
      }

      // Show browser notification
      const notification = new Notification(title, {
        icon: '/flower.svg',
        badge: '/flower.svg',
        tag: 'floristeria-encanto',
        renotify: true,
        requireInteraction: false,
        ...options,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, [settings.pushNotifications, settings.soundEnabled, permission]);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!settings.soundEnabled) return;

    try {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, [settings.soundEnabled]);

  // Schedule event reminder
  const scheduleEventReminder = useCallback((event: any, reminderTime: number = 24) => {
    if (!settings.eventReminders) return;

    const eventDate = new Date(event.start_date);
    const reminderDate = new Date(eventDate.getTime() - (reminderTime * 60 * 60 * 1000));
    const now = new Date();

    // Only schedule if reminder time is in the future
    if (reminderDate > now) {
      const timeUntilReminder = reminderDate.getTime() - now.getTime();
      
      setTimeout(() => {
        showNotification(`Recordatorio: ${event.title}`, {
          body: `El evento comienza en ${reminderTime} horas`,
          data: { eventId: event.id, type: 'reminder' },
        });
        
        toast(`Recordatorio: ${event.title} comienza en ${reminderTime} horas`, {
          icon: '📅',
          duration: 5000,
        });
      }, timeUntilReminder);
    }
  }, [settings.eventReminders, showNotification]);

  // Notify event update
  const notifyEventUpdate = useCallback((event: any, updateType: string) => {
    if (!settings.eventUpdates) return;

    const messages = {
      updated: `El evento "${event.title}" ha sido actualizado`,
      cancelled: `El evento "${event.title}" ha sido cancelado`,
      rescheduled: `El evento "${event.title}" ha sido reprogramado`,
      starting: `El evento "${event.title}" está comenzando`,
    };

    const message = messages[updateType as keyof typeof messages] || `Actualización del evento "${event.title}"`;

    showNotification('Actualización de Evento', {
      body: message,
      data: { eventId: event.id, type: updateType },
    });

    toast(message, {
      icon: updateType === 'cancelled' ? '❌' : '📅',
      duration: 5000,
    });
  }, [settings.eventUpdates, showNotification]);

  // Check for upcoming events and send notifications
  const checkUpcomingEvents = useCallback((events: any[]) => {
    if (!settings.eventReminders) return;

    const now = new Date();
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.start_date);
      const timeDiff = eventDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      // Events starting in 1 hour, 24 hours, or 1 week
      return (
        event.status === 'proximo' && 
        (
          (hoursDiff > 0.9 && hoursDiff < 1.1) ||
          (hoursDiff > 23.5 && hoursDiff < 24.5) ||
          (hoursDiff > 167 && hoursDiff < 169)
        )
      );
    });

    upcomingEvents.forEach(event => {
      const eventDate = new Date(event.start_date);
      const timeDiff = eventDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      let reminderText = '';
      if (hoursDiff < 1.1) {
        reminderText = 'en 1 hora';
      } else if (hoursDiff < 24.5) {
        reminderText = 'mañana';
      } else {
        reminderText = 'en 1 semana';
      }

      showNotification(`Recordatorio: ${event.title}`, {
        body: `El evento comienza ${reminderText}`,
        data: { eventId: event.id, type: 'reminder' },
      });
    });
  }, [settings.eventReminders, showNotification]);

  // Test notification
  const testNotification = useCallback(async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    showNotification('Notificación de Prueba', {
      body: 'Las notificaciones están funcionando correctamente',
      data: { type: 'test' },
    });

    toast.success('Notificación de prueba enviada');
  }, [permission, requestPermission, showNotification]);

  // Get notification status
  const getNotificationStatus = useCallback(() => {
    return {
      isSupported,
      permission,
      enabled: settings.pushNotifications && permission === 'granted',
      settings,
    };
  }, [isSupported, permission, settings]);

  return {
    settings,
    saveSettings,
    permission,
    isSupported,
    requestPermission,
    showNotification,
    scheduleEventReminder,
    notifyEventUpdate,
    checkUpcomingEvents,
    testNotification,
    getNotificationStatus,
    playNotificationSound,
  };
};
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';
import { Event, EventFilters } from '../types/events';
import toast from 'react-hot-toast';

export const useEvents = () => {
  const { user } = useAuth();
  const { 
    scheduleEventReminder, 
    notifyEventUpdate, 
    checkUpcomingEvents,
    settings: notificationSettings 
  } = useNotifications();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch events with optional filters
  const fetchEvents = async (filters?: EventFilters) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      // Apply filters
      if (filters?.startDate) {
        query = query.gte('start_date', filters.startDate);
      }
      
      if (filters?.endDate) {
        query = query.lte('end_date', filters.endDate);
      }
      
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      // Enhanced search functionality - case insensitive search across multiple fields
      if (filters?.search && filters.search.trim()) {
        const searchTerm = filters.search.trim();
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }

      const { data: eventsData, error } = await query;
      
      if (error) throw error;
      
      setEvents(eventsData || []);
      
      // Check for upcoming events and send notifications
      if (eventsData && notificationSettings.eventReminders) {
        checkUpcomingEvents(eventsData);
      }
      
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast.error('Error al cargar los eventos');
    } finally {
      setLoading(false);
    }
  };

  // Create new event
  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'current_attendees' | 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          created_by: user?.id,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Evento creado exitosamente');
      
      // Schedule reminder for new event
      if (data && notificationSettings.eventReminders) {
        scheduleEventReminder(data, 24); // 24 hours before
        scheduleEventReminder(data, 1);  // 1 hour before
      }
      
      await fetchEvents();
      return data;
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Error al crear el evento');
      throw error;
    }
  };

  // Update event
  const updateEvent = async (event: Event) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: event.title,
          description: event.description,
          start_date: event.start_date,
          end_date: event.end_date,
          location: event.location,
          category: event.category,
          status: event.status,
          max_attendees: event.max_attendees,
        })
        .eq('id', event.id);
      
      if (error) throw error;
      
      toast.success('Evento actualizado exitosamente');
      
      // Notify about event update
      if (notificationSettings.eventUpdates) {
        notifyEventUpdate(event, 'updated');
      }
      
      await fetchEvents();
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error(error.message || 'Error al actualizar el evento');
      throw error;
    }
  };

  // Delete event
  const deleteEvent = async (id: string) => {
    try {
      // Get event details before deletion for notification
      const eventToDelete = events.find(e => e.id === id);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Evento eliminado exitosamente');
      
      // Notify about event cancellation
      if (eventToDelete && notificationSettings.eventUpdates) {
        notifyEventUpdate(eventToDelete, 'cancelled');
      }
      
      await fetchEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.message || 'Error al eliminar el evento');
      throw error;
    }
  };

  // Update event statuses based on current time
  const updateEventStatuses = async () => {
    try {
      const now = new Date().toISOString();
      
      // Get events that need status updates
      const { data: eventsToUpdate, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .or(`and(start_date.lte.${now},end_date.gt.${now},status.eq.proximo),and(end_date.lte.${now},status.in.(proximo,en_curso))`);
      
      if (fetchError) throw fetchError;
      
      if (eventsToUpdate && eventsToUpdate.length > 0) {
        // Update events to 'en_curso' if they have started but not ended
        const eventsStarting = eventsToUpdate.filter(e => 
          new Date(e.start_date) <= new Date() && 
          new Date(e.end_date) > new Date() && 
          e.status === 'proximo'
        );
        
        // Update events to 'finalizado' if they have ended
        const eventsEnding = eventsToUpdate.filter(e => 
          new Date(e.end_date) <= new Date() && 
          ['proximo', 'en_curso'].includes(e.status)
        );
        
        // Batch update starting events
        if (eventsStarting.length > 0) {
          const { error: startError } = await supabase
            .from('events')
            .update({ status: 'en_curso' })
            .in('id', eventsStarting.map(e => e.id));
          
          if (startError) throw startError;
          
          // Notify about events starting
          if (notificationSettings.eventUpdates) {
            eventsStarting.forEach(event => {
              notifyEventUpdate(event, 'starting');
            });
          }
        }
        
        // Batch update ending events
        if (eventsEnding.length > 0) {
          const { error: endError } = await supabase
            .from('events')
            .update({ status: 'finalizado' })
            .in('id', eventsEnding.map(e => e.id));
          
          if (endError) throw endError;
        }
        
        // Refresh events if any updates were made
        if (eventsStarting.length > 0 || eventsEnding.length > 0) {
          await fetchEvents();
        }
      }
    } catch (error: any) {
      console.error('Error updating event statuses:', error);
      // Don't show error toast for automatic status updates
    }
  };

  // Get event by ID
  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  // Load events on mount and set up real-time updates
  useEffect(() => {
    if (user) {
      fetchEvents();
      updateEventStatuses();
      
      // Set up real-time subscription for events
      const eventsSubscription = supabase
        .channel('events-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'events' 
          }, 
          (payload) => {
            console.log('Event change detected:', payload);
            fetchEvents();
          }
        )
        .subscribe();

      // Update statuses every 5 minutes
      const statusUpdateInterval = setInterval(updateEventStatuses, 5 * 60 * 1000);

      // Check for upcoming events every hour
      const notificationInterval = setInterval(() => {
        if (events.length > 0) {
          checkUpcomingEvents(events);
        }
      }, 60 * 60 * 1000);

      return () => {
        eventsSubscription.unsubscribe();
        clearInterval(statusUpdateInterval);
        clearInterval(notificationInterval);
      };
    }
  }, [user]);

  return {
    events,
    loading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatuses,
    getEventById,
  };
};
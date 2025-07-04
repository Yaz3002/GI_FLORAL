import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Event, EventAttendee, EventFilters } from '../types/events';
import toast from 'react-hot-toast';

export const useEvents = () => {
  const { user } = useAuth();
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
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data: eventsData, error } = await query;
      
      if (error) throw error;
      
      // Simply set events without registration check since we removed that functionality
      setEvents(eventsData || []);
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
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Evento eliminado exitosamente');
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
      const { error } = await supabase.rpc('update_event_status');
      if (error) {
        console.error('Error calling update_event_status function:', error);
        // If the function doesn't exist, update manually
        await updateEventStatusesManually();
      } else {
        await fetchEvents();
      }
    } catch (error: any) {
      console.error('Error updating event statuses:', error);
      // Fallback to manual update
      await updateEventStatusesManually();
    }
  };

  // Manual event status update as fallback
  const updateEventStatusesManually = async () => {
    try {
      const now = new Date().toISOString();
      
      // Update events to 'en_curso' if they have started but not ended
      await supabase
        .from('events')
        .update({ status: 'en_curso' })
        .lte('start_date', now)
        .gt('end_date', now)
        .eq('status', 'proximo');
      
      // Update events to 'finalizado' if they have ended
      await supabase
        .from('events')
        .update({ status: 'finalizado' })
        .lte('end_date', now)
        .in('status', ['proximo', 'en_curso']);
      
      await fetchEvents();
    } catch (error: any) {
      console.error('Error in manual status update:', error);
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
          () => {
            fetchEvents();
          }
        )
        .subscribe();

      // Update statuses every 5 minutes
      const statusUpdateInterval = setInterval(updateEventStatuses, 5 * 60 * 1000);

      return () => {
        eventsSubscription.unsubscribe();
        clearInterval(statusUpdateInterval);
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
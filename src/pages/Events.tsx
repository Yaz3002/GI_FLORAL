import React, { useState, useEffect, useCallback } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Event, EventFilters } from '../types/events';
import EventCard from '../components/events/EventCard';
import EventForm from '../components/events/EventForm';
import EventFiltersComponent from '../components/events/EventFilters';
import EventCalendar from '../components/events/EventCalendar';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { Plus, Calendar, Grid, Bell, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Events: React.FC = () => {
  const {
    events,
    loading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatuses,
  } = useEvents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  const [refreshing, setRefreshing] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<EventFilters>({});
  const [isFiltering, setIsFiltering] = useState(false);

  // Handle opening the form modal for creating or editing
  const handleOpenModal = (event?: Event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  // Handle event form submission
  const handleSubmitEvent = async (eventData: any) => {
    try {
      if (currentEvent) {
        await updateEvent({ ...currentEvent, ...eventData });
      } else {
        await createEvent(eventData);
      }
      setIsModalOpen(false);
      setCurrentEvent(undefined);
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete);
        setEventToDelete(null);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  // Handle filter changes with improved UX
  const handleFilterChange = useCallback(async (filters: EventFilters) => {
    setIsFiltering(true);
    setCurrentFilters(filters);
    
    try {
      await fetchEvents(filters);
      
      // Show feedback for successful filtering
      if (Object.keys(filters).length > 0) {
        const filterCount = Object.keys(filters).length;
        toast.success(`Filtros aplicados (${filterCount} ${filterCount === 1 ? 'filtro' : 'filtros'})`);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Error al aplicar filtros');
    } finally {
      setIsFiltering(false);
    }
  }, [fetchEvents]);

  // Handle calendar event click
  const handleCalendarEventClick = (event: Event) => {
    handleOpenModal(event);
  };

  // Manual refresh with improved feedback
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await updateEventStatuses();
      await fetchEvents(currentFilters);
      toast.success('Eventos actualizados correctamente');
    } catch (error) {
      console.error('Error refreshing events:', error);
      toast.error('Error al actualizar eventos');
    } finally {
      setRefreshing(false);
    }
  };

  // Get upcoming events for notifications
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start_date);
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return event.status === 'proximo' && 
           eventDate >= now && 
           eventDate <= threeDaysFromNow;
  });

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      updateEventStatuses();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [updateEventStatuses]);

  // Show loading state during initial load
  if (loading && !events.length) {
    return (
      <div className="page-transition">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2">Cargando eventos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Calendario de Eventos</h1>
        
        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing || isFiltering}
            className="btn btn-outline btn-sm flex items-center gap-2"
            title="Actualizar eventos"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </span>
          </button>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-neutral-100 rounded-md p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
              title="Vista de tarjetas"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
              title="Vista de calendario"
            >
              <Calendar size={18} />
            </button>
          </div>

          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => handleOpenModal()}
          >
            <Plus size={18} />
            <span>Nuevo Evento</span>
          </button>
        </div>
      </div>

      {/* Upcoming events notification */}
      {upcomingEvents.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-md mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={20} />
            <h3 className="font-medium">Eventos Próximos</h3>
          </div>
          <p className="text-sm">
            Tienes {upcomingEvents.length} evento{upcomingEvents.length !== 1 ? 's' : ''} en los próximos 3 días:
          </p>
          <ul className="mt-2 text-sm space-y-1">
            {upcomingEvents.slice(0, 3).map(event => (
              <li key={event.id} className="flex items-center gap-2">
                <span>•</span>
                <span className="font-medium">{event.title}</span>
                <span className="text-primary-600">
                  - {new Date(event.start_date).toLocaleDateString('es-ES')}
                </span>
              </li>
            ))}
            {upcomingEvents.length > 3 && (
              <li className="text-primary-600 text-xs">
                +{upcomingEvents.length - 3} eventos más
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Enhanced Filters */}
      <EventFiltersComponent 
        onFilterChange={handleFilterChange} 
        loading={isFiltering}
      />

      {/* Content */}
      {viewMode === 'calendar' ? (
        <EventCalendar
          events={events}
          onEventClick={handleCalendarEventClick}
          view={calendarView}
          onViewChange={setCalendarView}
        />
      ) : (
        /* Grid View */
        <div>
          {events.length > 0 ? (
            <>
              {/* Results summary */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-neutral-600">
                  {Object.keys(currentFilters).length > 0 ? (
                    <>Mostrando {events.length} evento{events.length !== 1 ? 's' : ''} filtrado{events.length !== 1 ? 's' : ''}</>
                  ) : (
                    <>Total: {events.length} evento{events.length !== 1 ? 's' : ''}</>
                  )}
                </p>
                
                {isFiltering && (
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Filtrando...</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-lg">
              <Calendar className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <p className="text-neutral-500 mb-4">
                {Object.keys(currentFilters).length > 0 
                  ? 'No se encontraron eventos que coincidan con los filtros seleccionados' 
                  : 'No hay eventos programados'
                }
              </p>
              {Object.keys(currentFilters).length > 0 ? (
                <button
                  className="btn btn-outline"
                  onClick={() => handleFilterChange({})}
                >
                  Limpiar Filtros
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => handleOpenModal()}
                >
                  Crear Primer Evento
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Event Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentEvent(undefined);
        }}
        title={currentEvent ? 'Editar Evento' : 'Nuevo Evento'}
        size="lg"
      >
        <EventForm
          event={currentEvent}
          onSubmit={handleSubmitEvent}
          onCancel={() => {
            setIsModalOpen(false);
            setCurrentEvent(undefined);
          }}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Events;
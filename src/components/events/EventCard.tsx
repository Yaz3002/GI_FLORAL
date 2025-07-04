import React from 'react';
import { Event } from '../../types/events';
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../../hooks/useAuth';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const { user } = useAuth();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'social':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'academico':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'cultural':
        return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'comercial':
        return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'taller':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
      default:
        return 'bg-neutral-500/10 text-neutral-600 border-neutral-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'proximo':
        return 'bg-primary-500/10 text-primary-600';
      case 'en_curso':
        return 'bg-warning-500/10 text-warning-600';
      case 'finalizado':
        return 'bg-neutral-500/10 text-neutral-600';
      case 'cancelado':
        return 'bg-error-500/10 text-error-600';
      default:
        return 'bg-neutral-500/10 text-neutral-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      social: 'Social',
      academico: 'Académico',
      cultural: 'Cultural',
      comercial: 'Comercial',
      taller: 'Taller',
      otro: 'Otro',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      proximo: 'Próximo',
      en_curso: 'En Curso',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const isEventFull = event.max_attendees && event.current_attendees >= event.max_attendees;
  const isOwner = user?.id === event.created_by;

  // Format dates safely
  const formatEventDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMM yyyy', { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  const formatEventTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '--:--';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className={`badge border ${getCategoryColor(event.category)}`}>
            {getCategoryLabel(event.category)}
          </span>
          <span className={`badge ${getStatusColor(event.status)}`}>
            {getStatusLabel(event.status)}
          </span>
        </div>
        
        {showActions && isOwner && (
          <div className="flex gap-1">
            <button
              onClick={() => onEdit?.(event)}
              className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded-md transition-colors"
              title="Editar evento"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete?.(event.id)}
              className="p-1.5 text-neutral-500 hover:text-error-500 hover:bg-neutral-100 rounded-md transition-colors"
              title="Eliminar evento"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
      
      {event.description && (
        <p className="text-neutral-600 text-sm mb-4 line-clamp-3">{event.description}</p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Calendar size={16} className="flex-shrink-0" />
          <span>{formatEventDate(event.start_date)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Clock size={16} className="flex-shrink-0" />
          <span>
            {formatEventTime(event.start_date)} - {formatEventTime(event.end_date)}
          </span>
        </div>
        
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin size={16} className="flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        )}
        
        {event.max_attendees && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Users size={16} className="flex-shrink-0" />
            <span>
              {event.current_attendees} / {event.max_attendees} asistentes
              {isEventFull && <span className="text-error-500 ml-1">(Completo)</span>}
            </span>
          </div>
        )}
      </div>

      {/* Información adicional del evento */}
      <div className="pt-3 border-t border-neutral-100">
        <div className="text-sm text-neutral-500">
          Creado el {formatEventDate(event.created_at)}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
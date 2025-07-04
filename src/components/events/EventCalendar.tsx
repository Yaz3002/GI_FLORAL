import React, { useState, useMemo } from 'react';
import { Event } from '../../types/events';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO,
  isToday
} from 'date-fns';
import { es } from 'date-fns/locale';

interface EventCalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  view: 'month' | 'week';
  onViewChange: (view: 'month' | 'week') => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  onEventClick,
  view,
  onViewChange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(prev => subMonths(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar days for month view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventStart = parseISO(event.start_date);
      return isSameDay(eventStart, day);
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'social':
        return 'bg-blue-500';
      case 'academico':
        return 'bg-green-500';
      case 'cultural':
        return 'bg-purple-500';
      case 'comercial':
        return 'bg-orange-500';
      case 'taller':
        return 'bg-indigo-500';
      default:
        return 'bg-neutral-500';
    }
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="card">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate('prev')}
              className="p-2 hover:bg-neutral-100 rounded-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-md"
            >
              Hoy
            </button>
            <button
              onClick={() => navigate('next')}
              className="p-2 hover:bg-neutral-100 rounded-md"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange('month')}
            className={`btn btn-sm flex items-center gap-1 ${
              view === 'month' ? 'btn-primary' : 'btn-outline'
            }`}
          >
            <CalendarIcon size={16} />
            <span>Mes</span>
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={`btn btn-sm flex items-center gap-1 ${
              view === 'week' ? 'btn-primary' : 'btn-outline'
            }`}
          >
            <List size={16} />
            <span>Lista</span>
          </button>
        </div>
      </div>

      {view === 'month' ? (
        /* Month View */
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-neutral-500">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map(day => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] p-2 border border-neutral-100 ${
                  isCurrentMonth ? 'bg-white' : 'bg-neutral-50'
                } ${isDayToday ? 'bg-primary-50 border-primary-200' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'
                } ${isDayToday ? 'text-primary-600' : ''}`}>
                  {format(day, 'd')}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className={`w-full text-left p-1 rounded text-xs text-white truncate ${getCategoryColor(event.category)} hover:opacity-80`}
                      title={event.title}
                    >
                      {event.title}
                    </button>
                  ))}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-neutral-500">
                      +{dayEvents.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Week/List View */
        <div className="space-y-4">
          {events
            .filter(event => {
              const eventDate = parseISO(event.start_date);
              const monthStart = startOfMonth(currentDate);
              const monthEnd = endOfMonth(currentDate);
              return eventDate >= monthStart && eventDate <= monthEnd;
            })
            .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
            .map(event => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer"
                onClick={() => onEventClick?.(event)}
              >
                <div className={`w-4 h-4 rounded-full ${getCategoryColor(event.category)}`} />
                
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-neutral-600">
                    {format(parseISO(event.start_date), 'dd MMM yyyy - HH:mm', { locale: es })}
                  </p>
                  {event.location && (
                    <p className="text-sm text-neutral-500">{event.location}</p>
                  )}
                </div>

                <div className="text-right">
                  <span className={`badge ${
                    event.status === 'proximo' ? 'badge-primary' :
                    event.status === 'en_curso' ? 'badge-warning' :
                    event.status === 'finalizado' ? 'badge-neutral' :
                    'badge-error'
                  }`}>
                    {event.status === 'proximo' ? 'Próximo' :
                     event.status === 'en_curso' ? 'En Curso' :
                     event.status === 'finalizado' ? 'Finalizado' :
                     'Cancelado'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
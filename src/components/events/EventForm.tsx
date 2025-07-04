import React, { useState, useEffect } from 'react';
import { Event, EventCategory } from '../../types/events';

interface EventFormProps {
  event?: Event;
  onSubmit: (event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'current_attendees' | 'created_by'>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    category: 'social' as EventCategory,
    status: 'proximo' as const,
    max_attendees: null as number | null,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        start_date: event.start_date.slice(0, 16), // Format for datetime-local input
        end_date: event.end_date.slice(0, 16),
        location: event.location,
        category: event.category,
        status: event.status,
        max_attendees: event.max_attendees,
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? null : parseInt(value, 10),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }
    
    onSubmit({
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
    });
  };

  const categoryOptions = [
    { value: 'social', label: 'Social' },
    { value: 'academico', label: 'Académico' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'taller', label: 'Taller' },
    { value: 'otro', label: 'Otro' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="form-group">
        <label htmlFor="title" className="form-label">Título del Evento</label>
        <input
          type="text"
          id="title"
          name="title"
          className="input"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Descripción</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="input"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe el evento, actividades, requisitos, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="form-group">
          <label htmlFor="start_date" className="form-label">Fecha y Hora de Inicio</label>
          <input
            type="datetime-local"
            id="start_date"
            name="start_date"
            className="input"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="end_date" className="form-label">Fecha y Hora de Fin</label>
          <input
            type="datetime-local"
            id="end_date"
            name="end_date"
            className="input"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="location" className="form-label">Ubicación</label>
        <input
          type="text"
          id="location"
          name="location"
          className="input"
          value={formData.location}
          onChange={handleChange}
          placeholder="Dirección o lugar del evento"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="form-group">
          <label htmlFor="category" className="form-label">Categoría</label>
          <select
            id="category"
            name="category"
            className="select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="max_attendees" className="form-label">Máximo de Asistentes (opcional)</label>
          <input
            type="number"
            id="max_attendees"
            name="max_attendees"
            className="input"
            value={formData.max_attendees || ''}
            onChange={handleChange}
            min="1"
            placeholder="Sin límite"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {event ? 'Actualizar Evento' : 'Crear Evento'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      // Format dates for datetime-local input
      const formatDateForInput = (dateString: string) => {
        try {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        } catch (error) {
          console.error('Error formatting date:', error);
          return '';
        }
      };

      setFormData({
        title: event.title,
        description: event.description,
        start_date: formatDateForInput(event.start_date),
        end_date: formatDateForInput(event.end_date),
        location: event.location,
        category: event.category,
        status: event.status,
        max_attendees: event.max_attendees,
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'La fecha de inicio es requerida';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'La fecha de fin es requerida';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (startDate >= endDate) {
        newErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }

      // Check if start date is in the past (only for new events)
      if (!event && startDate < new Date()) {
        newErrors.start_date = 'La fecha de inicio no puede ser en el pasado';
      }
    }

    if (formData.max_attendees !== null && formData.max_attendees < 1) {
      newErrors.max_attendees = 'El número máximo de asistentes debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      onSubmit({
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
        <label htmlFor="title" className="form-label">
          Título del Evento <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className={`input ${errors.title ? 'border-error-500' : ''}`}
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: Taller de Arreglos Florales"
        />
        {errors.title && <p className="text-error-500 text-sm mt-1">{errors.title}</p>}
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
          <label htmlFor="start_date" className="form-label">
            Fecha y Hora de Inicio <span className="text-error-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="start_date"
            name="start_date"
            className={`input ${errors.start_date ? 'border-error-500' : ''}`}
            value={formData.start_date}
            onChange={handleChange}
          />
          {errors.start_date && <p className="text-error-500 text-sm mt-1">{errors.start_date}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="end_date" className="form-label">
            Fecha y Hora de Fin <span className="text-error-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="end_date"
            name="end_date"
            className={`input ${errors.end_date ? 'border-error-500' : ''}`}
            value={formData.end_date}
            onChange={handleChange}
          />
          {errors.end_date && <p className="text-error-500 text-sm mt-1">{errors.end_date}</p>}
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
          <label htmlFor="category" className="form-label">
            Categoría <span className="text-error-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            className="select"
            value={formData.category}
            onChange={handleChange}
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="max_attendees" className="form-label">
            Máximo de Asistentes (opcional)
          </label>
          <input
            type="number"
            id="max_attendees"
            name="max_attendees"
            className={`input ${errors.max_attendees ? 'border-error-500' : ''}`}
            value={formData.max_attendees || ''}
            onChange={handleChange}
            min="1"
            placeholder="Sin límite"
          />
          {errors.max_attendees && <p className="text-error-500 text-sm mt-1">{errors.max_attendees}</p>}
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
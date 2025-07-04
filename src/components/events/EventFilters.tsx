import React, { useState } from 'react';
import { EventFilters, EventCategory, EventStatus } from '../../types/events';
import { Search, Filter } from 'lucide-react';

interface EventFiltersProps {
  onFilterChange: (filters: EventFilters) => void;
}

const EventFiltersComponent: React.FC<EventFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<EventFilters>({
    startDate: '',
    endDate: '',
    category: 'all',
    status: 'all',
    search: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value === '' ? undefined : value,
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      category: 'all' as const,
      status: 'all' as const,
      search: '',
    };
    
    setFilters(resetFilters);
    onFilterChange({});
  };

  const categoryOptions = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'social', label: 'Social' },
    { value: 'academico', label: 'Académico' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'taller', label: 'Taller' },
    { value: 'otro', label: 'Otro' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'proximo', label: 'Próximos' },
    { value: 'en_curso', label: 'En Curso' },
    { value: 'finalizado', label: 'Finalizados' },
    { value: 'cancelado', label: 'Cancelados' },
  ];

  return (
    <div className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-primary-500" />
        <h3 className="font-semibold text-lg">Filtrar Eventos</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="form-group">
          <label htmlFor="search" className="form-label">Buscar</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-neutral-400" />
            </div>
            <input
              type="text"
              id="search"
              name="search"
              className="input pl-10"
              placeholder="Título o descripción..."
              value={filters.search}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="startDate" className="form-label">Desde</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="input"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate" className="form-label">Hasta</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="input"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">Categoría</label>
          <select
            id="category"
            name="category"
            className="select"
            value={filters.category}
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
          <label htmlFor="status" className="form-label">Estado</label>
          <select
            id="status"
            name="status"
            className="select"
            value={filters.status}
            onChange={handleChange}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleReset}
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

export default EventFiltersComponent;
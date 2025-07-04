import React, { useState, useCallback } from 'react';
import { EventFilters, EventCategory, EventStatus } from '../../types/events';
import { Search, Filter, X } from 'lucide-react';

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

  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Debounced search handler
  const debouncedSearch = useCallback((searchTerm: string) => {
    const newFilters = {
      ...filters,
      search: searchTerm.trim() || undefined,
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  // Handle search input changes with real-time feedback
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Debounce the actual search
    const timeoutId = setTimeout(() => {
      debouncedSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput('');
    const newFilters = {
      ...filters,
      search: undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle other filter changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value === '' || value === 'all' ? undefined : value,
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Reset all filters
  const handleReset = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      category: 'all' as const,
      status: 'all' as const,
      search: '',
    };
    
    setFilters(resetFilters);
    setSearchInput('');
    onFilterChange({});
  };

  // Check if any filters are active
  const hasActiveFilters = filters.search || 
                          filters.startDate || 
                          filters.endDate || 
                          (filters.category && filters.category !== 'all') || 
                          (filters.status && filters.status !== 'all');

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-primary-500" />
          <h3 className="font-semibold text-lg">Filtrar Eventos</h3>
          {hasActiveFilters && (
            <span className="badge badge-primary text-xs">
              Filtros activos
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="btn btn-outline btn-sm flex items-center gap-1"
          >
            <X size={14} />
            <span>Limpiar Todo</span>
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Enhanced Search Input */}
        <div className="form-group">
          <label htmlFor="search" className="form-label">
            Buscar Eventos
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className={`w-4 h-4 transition-colors ${
                isSearchFocused ? 'text-primary-500' : 'text-neutral-400'
              }`} />
            </div>
            <input
              type="text"
              id="search"
              name="search"
              className={`input pl-10 pr-10 transition-all duration-200 ${
                isSearchFocused ? 'ring-2 ring-primary-500 border-primary-500' : ''
              } ${searchInput ? 'bg-primary-50' : ''}`}
              placeholder="Buscar por título, descripción o ubicación..."
              value={searchInput}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchInput && (
            <p className="text-sm text-neutral-500 mt-1">
              Buscando: "{searchInput}"
            </p>
          )}
        </div>

        {/* Other Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-3 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 mb-2">Filtros activos:</p>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm">
                  Búsqueda: "{filters.search}"
                  <button
                    onClick={clearSearch}
                    className="hover:text-primary-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.startDate && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm">
                  Desde: {new Date(filters.startDate).toLocaleDateString('es-ES')}
                </span>
              )}
              {filters.endDate && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm">
                  Hasta: {new Date(filters.endDate).toLocaleDateString('es-ES')}
                </span>
              )}
              {filters.category && filters.category !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm">
                  Categoría: {categoryOptions.find(opt => opt.value === filters.category)?.label}
                </span>
              )}
              {filters.status && filters.status !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm">
                  Estado: {statusOptions.find(opt => opt.value === filters.status)?.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFiltersComponent;
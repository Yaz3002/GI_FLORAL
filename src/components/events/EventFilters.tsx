import React, { useState, useCallback, useEffect } from 'react';
import { EventFilters, EventCategory, EventStatus } from '../../types/events';
import { Search, Filter, X, RefreshCw } from 'lucide-react';

interface EventFiltersProps {
  onFilterChange: (filters: EventFilters) => void;
  loading?: boolean;
}

const EventFiltersComponent: React.FC<EventFiltersProps> = ({ 
  onFilterChange, 
  loading = false 
}) => {
  const [filters, setFilters] = useState<EventFilters>({
    startDate: '',
    endDate: '',
    category: 'all',
    status: 'all',
    search: '',
  });

  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Check if any filters are active
  useEffect(() => {
    const active = !!(
      filters.search || 
      filters.startDate || 
      filters.endDate || 
      (filters.category && filters.category !== 'all') || 
      (filters.status && filters.status !== 'all')
    );
    setHasActiveFilters(active);
  }, [filters]);

  // Debounced search handler
  const debouncedSearch = useCallback((searchTerm: string) => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchTerm.trim() || undefined,
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  // Handle search input changes with real-time feedback
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    // Debounce the actual search
    debouncedSearch(value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput('');
    setFilters(prev => ({
      ...prev,
      search: undefined,
    }));
  };

  // Handle other filter changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' || value === 'all' ? undefined : value,
    }));
  };

  // Apply filters
  const handleApplyFilters = async () => {
    if (!hasActiveFilters) return;
    
    setIsApplying(true);
    try {
      // Clean filters object - remove undefined values
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '' && value !== 'all') {
          acc[key as keyof EventFilters] = value;
        }
        return acc;
      }, {} as EventFilters);

      onFilterChange(cleanFilters);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsApplying(false);
    }
  };

  // Reset all filters
  const handleClearAllFilters = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      category: 'all' as const,
      status: 'all' as const,
      search: '',
    };
    
    setFilters(resetFilters);
    setSearchInput('');
    
    // Clear URL parameters and show all events
    onFilterChange({});
  };

  // Auto-apply search filter (for real-time search experience)
  useEffect(() => {
    if (filters.search !== undefined) {
      const searchOnlyFilters = { search: filters.search };
      onFilterChange(searchOnlyFilters);
    }
  }, [filters.search, onFilterChange]);

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
            <span className="badge badge-primary text-xs animate-fade-in">
              Filtros activos
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={handleClearAllFilters}
            className="btn btn-outline btn-sm flex items-center gap-1 hover:bg-error-50 hover:border-error-300 hover:text-error-600 transition-colors"
            disabled={loading}
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
              disabled={loading}
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 transition-colors"
                title="Limpiar búsqueda"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchInput && (
            <p className="text-sm text-neutral-500 mt-1 animate-fade-in">
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
          <button
            onClick={handleApplyFilters}
            disabled={!hasActiveFilters || loading || isApplying}
            className={`btn flex items-center gap-2 ${
              hasActiveFilters 
                ? 'btn-primary' 
                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {isApplying ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Filter size={16} />
            )}
            <span>
              {isApplying ? 'Aplicando...' : 'Buscar Eventos'}
            </span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearAllFilters}
              className="btn btn-outline flex items-center gap-2"
              disabled={loading}
            >
              <X size={16} />
              <span>Limpiar Filtros</span>
            </button>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-3 border-t border-neutral-200 animate-fade-in">
            <p className="text-sm text-neutral-600 mb-2">Filtros activos:</p>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm">
                  Búsqueda: "{filters.search}"
                  <button
                    onClick={clearSearch}
                    className="hover:text-primary-900 transition-colors"
                    disabled={loading}
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-4 animate-fade-in">
            <RefreshCw size={20} className="animate-spin text-primary-500 mr-2" />
            <span className="text-neutral-600">Cargando eventos...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFiltersComponent;
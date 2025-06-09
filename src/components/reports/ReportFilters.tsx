import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

interface ReportFilters {
  startDate?: string;
  endDate?: string;
  productId?: string;
  category?: string;
  supplierId?: string;
  transactionType?: 'entry' | 'exit' | 'all';
}

interface ReportFiltersProps {
  onFilterChange: (filters: ReportFilters) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ onFilterChange }) => {
  const { products, categories, suppliers } = useAppContext();
  
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: undefined,
    endDate: undefined,
    productId: undefined,
    category: undefined,
    supplierId: undefined,
    transactionType: 'all',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle empty values
    const newValue = value === '' ? undefined : value;
    
    const newFilters = {
      ...filters,
      [name]: newValue,
    };
    
    setFilters(newFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: undefined,
      endDate: undefined,
      productId: undefined,
      category: undefined,
      supplierId: undefined,
      transactionType: 'all' as const,
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="card mb-6">
      <h3 className="font-semibold text-lg mb-4">Filtrar Reportes</h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="form-group">
          <label htmlFor="startDate" className="form-label">Fecha Inicio</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="input"
            value={filters.startDate || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="endDate" className="form-label">Fecha Fin</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="input"
            value={filters.endDate || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="transactionType" className="form-label">Tipo de Movimiento</label>
          <select
            id="transactionType"
            name="transactionType"
            className="select"
            value={filters.transactionType || 'all'}
            onChange={handleChange}
          >
            <option value="all">Todos</option>
            <option value="entry">Entradas</option>
            <option value="exit">Salidas</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="productId" className="form-label">Producto</label>
          <select
            id="productId"
            name="productId"
            className="select"
            value={filters.productId || ''}
            onChange={handleChange}
          >
            <option value="">Todos los productos</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="category" className="form-label">Categoría</label>
          <select
            id="category"
            name="category"
            className="select"
            value={filters.category || ''}
            onChange={handleChange}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="supplierId" className="form-label">Proveedor</label>
          <select
            id="supplierId"
            name="supplierId"
            className="select"
            value={filters.supplierId || ''}
            onChange={handleChange}
          >
            <option value="">Todos los proveedores</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end gap-3 md:col-span-2 lg:col-span-3">
          <button type="submit" className="btn btn-primary">
            Aplicar Filtros
          </button>
          <button type="button" className="btn btn-outline" onClick={handleReset}>
            Restablecer
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportFilters;
import React, { useState, useEffect } from 'react';
import { Supplier } from '../../types';

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmit: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'> | Supplier) => void;
  onCancel: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    rating: 3,
    notes: '',
  });

  // If editing, load the supplier data
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact_name: supplier.contact_name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        rating: supplier.rating,
        notes: supplier.notes,
      });
    }
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number' || type === 'range') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: parseFloat(value) || 0 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For existing suppliers, preserve the id, created_at, and updated_at
    if (supplier) {
      onSubmit({
        ...supplier,
        ...formData,
      });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nombre de la Empresa</label>
          <input
            type="text"
            id="name"
            name="name"
            className="input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contact_name" className="form-label">Persona de Contacto</label>
          <input
            type="text"
            id="contact_name"
            name="contact_name"
            className="input"
            value={formData.contact_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone" className="form-label">Teléfono</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="input"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group md:col-span-2">
          <label htmlFor="address" className="form-label">Dirección</label>
          <input
            type="text"
            id="address"
            name="address"
            className="input"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group md:col-span-2">
          <label htmlFor="rating" className="form-label">
            Calificación: {formData.rating}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm">1</span>
            <input
              type="range"
              id="rating"
              name="rating"
              min="1"
              max="5"
              step="0.1"
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
              value={formData.rating}
              onChange={handleChange}
            />
            <span className="text-sm">5</span>
          </div>
        </div>
        
        <div className="form-group md:col-span-2">
          <label htmlFor="notes" className="form-label">Notas</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="input"
            value={formData.notes}
            onChange={handleChange}
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
          {supplier ? 'Actualizar Proveedor' : 'Crear Proveedor'}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
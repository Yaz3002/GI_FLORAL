import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import SupplierForm from '../components/suppliers/SupplierForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { Plus, Search, Edit, Trash2, Star, Phone, Mail } from 'lucide-react';
import { Supplier } from '../types';
import { Link } from 'react-router-dom';

const Suppliers: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | undefined>(undefined);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Handle opening the form modal for creating or editing
  const handleOpenModal = (supplier?: Supplier) => {
    setCurrentSupplier(supplier);
    setIsModalOpen(true);
  };
  
  // Handle supplier form submission
  const handleSubmitSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'> | Supplier) => {
    if ('id' in supplierData) {
      updateSupplier(supplierData as Supplier);
    } else {
      addSupplier(supplierData);
    }
    setIsModalOpen(false);
  };
  
  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setSupplierToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (supplierToDelete) {
      deleteSupplier(supplierToDelete);
      setSupplierToDelete(null);
    }
  };
  
  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter(supplier => {
    return (
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-warning-500 fill-warning-500" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-warning-500" />
            <Star className="absolute top-0 left-0 w-4 h-4 text-warning-500 fill-warning-500 overflow-hidden\" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-warning-500" />
        ))}
        <span className="ml-1 text-xs text-neutral-500">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="page-transition">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Proveedores</h1>
        
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => handleOpenModal()}
        >
          <Plus size={18} />
          <span>Nuevo Proveedor</span>
        </button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-neutral-400" />
          </div>
          <input
            type="search"
            className="input pl-10"
            placeholder="Buscar por nombre o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Suppliers List */}
      {filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map(supplier => (
            <div key={supplier.id} className="card">
              <div className="flex justify-between mb-3">
                <h3 className="font-semibold truncate">{supplier.name}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenModal(supplier)}
                    className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded-md"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(supplier.id)}
                    className="p-1.5 text-neutral-500 hover:text-error-500 hover:bg-neutral-100 rounded-md"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-neutral-700">{supplier.contact_name}</p>
                  {renderRating(supplier.rating)}
                </div>
                
                <div className="flex flex-col gap-1 mt-3">
                  <a 
                    href={`mailto:${supplier.email}`}
                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600"
                  >
                    <Mail size={14} />
                    <span className="truncate">{supplier.email}</span>
                  </a>
                  <a 
                    href={`tel:${supplier.phone}`}
                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600"
                  >
                    <Phone size={14} />
                    <span>{supplier.phone}</span>
                  </a>
                </div>
                
                <div className="pt-3 mt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-500 mb-1">Dirección:</p>
                  <p className="text-sm text-neutral-700">{supplier.address}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <Link
                  to={`/proveedores/${supplier.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Ver detalles y productos
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <p className="text-neutral-500">No se encontraron proveedores</p>
          {searchTerm && (
            <button
              className="mt-2 text-primary-600 hover:text-primary-700"
              onClick={() => setSearchTerm('')}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}
      
      {/* Supplier Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        size="lg"
      >
        <SupplierForm
          supplier={currentSupplier}
          onSubmit={handleSubmitSupplier}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Suppliers;
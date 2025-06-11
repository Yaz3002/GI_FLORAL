import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/products/ProductCard';
import SupplierForm from '../components/suppliers/SupplierForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Star } from 'lucide-react';

const SupplierDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSupplierById, updateSupplier, deleteSupplier, products } = useAppContext();
  
  const supplier = getSupplierById(id || '');
  const supplierProducts = products.filter(p => p.supplierID === id);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDeleteSupplier = () => {
    if (supplier) {
      deleteSupplier(supplier.id);
      navigate('/proveedores');
    }
  };
  
  const handleSupplierUpdate = (updatedSupplier: any) => {
    updateSupplier(updatedSupplier);
    setIsEditModalOpen(false);
  };
  
  if (!supplier) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Proveedor no encontrado</h2>
        <Link to="/proveedores" className="btn btn-primary">
          Volver a Proveedores
        </Link>
      </div>
    );
  }
  
  // Render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-5 h-5 text-warning-500 fill-warning-500" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-5 h-5 text-warning-500" />
            <Star className="absolute top-0 left-0 w-5 h-5 text-warning-500 fill-warning-500 overflow-hidden\" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-5 h-5 text-warning-500" />
        ))}
        <span className="ml-1 text-sm text-neutral-500">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="page-transition">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate('/proveedores')}
          className="text-neutral-500 hover:text-neutral-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{supplier.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Info */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Información del Proveedor</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn btn-outline btn-sm flex items-center gap-1"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="btn btn-sm bg-error-500/10 text-error-500 hover:bg-error-500/20 focus:ring-error-500 flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Calificación</h3>
                {renderRating(supplier.rating)}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-neutral-500">Persona de Contacto</h3>
                <p className="font-medium">{supplier.contact_name}</p>
              </div>
              
              <div className="space-y-2">
                <a 
                  href={`mailto:${supplier.email}`}
                  className="flex items-center gap-2 text-neutral-600 hover:text-primary-600"
                >
                  <Mail size={18} />
                  <span>{supplier.email}</span>
                </a>
                
                <a 
                  href={`tel:${supplier.phone}`}
                  className="flex items-center gap-2 text-neutral-600 hover:text-primary-600"
                >
                  <Phone size={18} />
                  <span>{supplier.phone}</span>
                </a>
                
                <div className="flex items-start gap-2 text-neutral-600">
                  <MapPin size={18} className="mt-1 flex-shrink-0" />
                  <span>{supplier.address}</span>
                </div>
              </div>
              
              {supplier.notes && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-500">Notas</h3>
                  <p className="text-neutral-600 whitespace-pre-line">{supplier.notes}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Statistics */}
          <div className="card mt-6">
            <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="text-sm text-neutral-500">Productos</h3>
                <p className="text-2xl font-semibold">{supplierProducts.length}</p>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="text-sm text-neutral-500">Valor Total</h3>
                <p className="text-2xl font-semibold">
                  {supplierProducts
                    .reduce((total, product) => total + (product.purchasePrice * product.stock), 0)
                    .toFixed(2)} S/
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Productos del Proveedor</h2>
            
            {supplierProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supplierProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                No hay productos registrados para este proveedor
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Proveedor"
        size="lg"
      >
        <SupplierForm
          supplier={supplier}
          onSubmit={handleSupplierUpdate}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteSupplier}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar a ${supplier.name}? Esta acción no se puede deshacer y afectará a ${supplierProducts.length} productos asociados.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default SupplierDetail;
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/common/Modal';
import TransactionForm from '../components/inventory/TransactionForm';
import { Link } from 'react-router-dom';
import { Plus, Filter, ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const Inventory: React.FC = () => {
  const { transactions, products, addInventoryTransaction, loading } = useAppContext();
  
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'entry' | 'exit'>('all');
  const [sortField, setSortField] = useState<'created_at' | 'product_name'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleSortClick = (field: 'created_at' | 'product_name') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const handleAddTransaction = async (transactionData: any) => {
    try {
      await addInventoryTransaction(transactionData);
      setIsTransactionModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };
  
  // Filter and sort transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      (transaction.product_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' ? true : transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortField === 'created_at') {
      return sortDirection === 'asc'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      const aName = a.product_name || '';
      const bName = b.product_name || '';
      return sortDirection === 'asc'
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }
  });
  
  // Check for low stock products
  const lowStockProducts = products.filter(p => p.stock <= p.min_stock_level);

  if (loading) {
    return (
      <div className="page-transition">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2">Cargando inventario...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-transition">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Control de Inventario</h1>
        
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setIsTransactionModalOpen(true)}
        >
          <Plus size={18} />
          <span>Nuevo Movimiento</span>
        </button>
      </div>
      
      {/* Low stock alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-warning-500/10 border border-warning-500/20 text-warning-600 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} />
            <h3 className="font-medium">Alerta de Stock Bajo</h3>
          </div>
          <p className="mb-2">Los siguientes productos están por debajo del nivel mínimo de stock:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-3">
            {lowStockProducts.slice(0, 6).map(product => (
              <Link 
                key={product.id}
                to={`/productos/${product.id}`}
                className="text-sm bg-white p-2 rounded border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <span className="font-medium">{product.name}</span>
                <div className="flex justify-between mt-1">
                  <span className="text-neutral-500">Stock: {product.stock}</span>
                  <span className="text-error-500">Mín: {product.min_stock_level}</span>
                </div>
              </Link>
            ))}
          </div>
          {lowStockProducts.length > 6 && (
            <div className="mt-2 text-right">
              <Link to="/productos?stock=low" className="text-primary-600 text-sm hover:underline">
                Ver todos los productos con stock bajo
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="searchTerm" className="form-label">Buscar por producto</label>
            <input
              type="search"
              id="searchTerm"
              className="input"
              placeholder="Nombre del producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="typeFilter" className="form-label">Tipo de movimiento</label>
            <select
              id="typeFilter"
              className="select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="all">Todos</option>
              <option value="entry">Entradas</option>
              <option value="exit">Salidas</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Movimientos de Inventario</h2>
        
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th 
                  className="table-header-cell cursor-pointer"
                  onClick={() => handleSortClick('product_name')}
                >
                  <div className="flex items-center gap-1">
                    <span>Producto</span>
                    {sortField === 'product_name' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th className="table-header-cell">Tipo</th>
                <th className="table-header-cell">Cantidad</th>
                <th className="table-header-cell">Stock Anterior</th>
                <th className="table-header-cell">Stock Nuevo</th>
                <th className="table-header-cell">Notas</th>
                <th 
                  className="table-header-cell cursor-pointer"
                  onClick={() => handleSortClick('created_at')}
                >
                  <div className="flex items-center gap-1">
                    <span>Fecha</span>
                    {sortField === 'created_at' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="table-body-cell">
                      {transaction.product_id ? (
                        <Link 
                          to={`/productos/${transaction.product_id}`}
                          className="text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          {transaction.product_name}
                        </Link>
                      ) : (
                        <span className="text-neutral-500">{transaction.product_name}</span>
                      )}
                    </td>
                    <td className="table-body-cell">
                      <span className={`badge ${
                        transaction.type === 'entry' ? 'badge-success' : 'badge-error'
                      }`}>
                        {transaction.type === 'entry' ? 'Entrada' : 'Salida'}
                      </span>
                    </td>
                    <td className="table-body-cell font-medium">
                      {transaction.quantity} uds.
                    </td>
                    <td className="table-body-cell">
                      {transaction.previous_stock} uds.
                    </td>
                    <td className="table-body-cell">
                      {transaction.new_stock} uds.
                    </td>
                    <td className="table-body-cell">
                      <span className="text-sm text-neutral-600">
                        {transaction.notes || '-'}
                      </span>
                    </td>
                    <td className="table-body-cell text-neutral-500">
                      {format(parseISO(transaction.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="table-body-cell text-center py-8 text-neutral-500">
                    No se encontraron movimientos de inventario
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Transaction Modal */}
      <Modal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        title="Registrar Movimiento de Inventario"
      >
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setIsTransactionModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Inventory;
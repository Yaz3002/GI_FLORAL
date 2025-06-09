import React from 'react';
import { useAppContext } from '../context/AppContext';
import StatCard from '../components/dashboard/StatCard';
import InventoryChart from '../components/dashboard/InventoryChart';
import { ShoppingBag, TruckIcon, AlertTriangle, DollarSign, Flower2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { products, suppliers, transactions, categories, loading } = useAppContext();
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-PE', { 
      style: 'currency', 
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Calculate dashboard metrics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= p.min_stock_level).length;
  const totalSuppliers = suppliers.length;
  const inventoryValue = products.reduce((total, p) => total + (p.purchase_price * p.stock), 0);
  
  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);
  
  // Get top selling products (based on exit transactions)
  const getTopSellingProducts = () => {
    const productSales: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'exit' && transaction.product_id) {
        if (!productSales[transaction.product_id]) {
          productSales[transaction.product_id] = 0;
        }
        productSales[transaction.product_id] += transaction.quantity;
      }
    });
    
    return Object.entries(productSales)
      .map(([productId, quantitySold]) => {
        const product = products.find(p => p.id === productId);
        return {
          productId,
          productName: product ? product.name : 'Producto eliminado',
          quantitySold,
        };
      })
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);
  };
  
  // Get stock distribution by category
  const getStockDistribution = () => {
    const categoryStock: Record<string, number> = {};
    
    products.forEach(product => {
      const categoryName = product.category_name || 'Sin categoría';
      if (!categoryStock[categoryName]) {
        categoryStock[categoryName] = 0;
      }
      categoryStock[categoryName] += product.stock;
    });
    
    return Object.entries(categoryStock).map(([category, value]) => ({
      name: category,
      value,
    }));
  };

  const topSellingProducts = getTopSellingProducts();
  const stockDistribution = getStockDistribution();

  if (loading) {
    return (
      <div className="page-transition">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2">Cargando dashboard...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-transition">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-neutral-500">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Total de Productos"
          value={totalProducts}
          icon={<ShoppingBag size={18} />}
          color="primary"
        />
        
        <StatCard
          title="Valor de Inventario"
          value={formatCurrency(inventoryValue)}
          icon={<DollarSign size={18} />}
          color="secondary"
        />
        
        <StatCard
          title="Productos en Alerta"
          value={lowStockProducts}
          icon={<AlertTriangle size={18} />}
          color="warning"
          trend={
            lowStockProducts > 0
              ? { value: lowStockProducts, label: 'productos con stock bajo', positive: false }
              : undefined
          }
        />
        
        <StatCard
          title="Proveedores"
          value={totalSuppliers}
          icon={<TruckIcon size={18} />}
          color="accent"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Distribución de Stock por Categoría</h3>
            </div>
            {stockDistribution.length > 0 ? (
              <InventoryChart data={stockDistribution} />
            ) : (
              <div className="text-center py-8 text-neutral-500">
                No hay datos disponibles
              </div>
            )}
          </div>
        </div>
        
        {/* Top Selling Products */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Productos Más Vendidos</h3>
            </div>
            
            {topSellingProducts.length > 0 ? (
              <div className="space-y-4">
                {topSellingProducts.map((product, index) => (
                  <div key={product.productId} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-primary-${100 + (index * 100)} flex items-center justify-center text-primary-600`}>
                      <Flower2 size={16} />
                    </div>
                    <div className="flex-1">
                      <Link 
                        to={`/productos/${product.productId}`}
                        className="font-medium text-neutral-800 hover:text-primary-600"
                      >
                        {product.productName}
                      </Link>
                      <p className="text-sm text-neutral-500">{product.quantitySold} unidades vendidas</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                No hay datos de ventas disponibles
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Movimientos Recientes</h3>
          <Link 
            to="/inventario" 
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Ver todos
          </Link>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Producto</th>
                <th className="table-header-cell">Tipo</th>
                <th className="table-header-cell">Cantidad</th>
                <th className="table-header-cell">Fecha</th>
              </tr>
            </thead>
            <tbody className="table-body divide-y divide-neutral-200">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
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
                        transaction.type === 'entry' 
                          ? 'badge-success' 
                          : 'badge-error'
                      }`}>
                        {transaction.type === 'entry' ? 'Entrada' : 'Salida'}
                      </span>
                    </td>
                    <td className="table-body-cell font-medium">
                      {transaction.quantity} uds.
                    </td>
                    <td className="table-body-cell text-neutral-500">
                      {new Date(transaction.created_at).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="table-body-cell text-center py-4 text-neutral-500">
                    No hay transacciones recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
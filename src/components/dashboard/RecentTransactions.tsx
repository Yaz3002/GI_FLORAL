import React from 'react';
import { InventoryTransaction } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface RecentTransactionsProps {
  transactions: InventoryTransaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
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
              <th className="table-header-cell">Usuario</th>
              <th className="table-header-cell">Fecha</th>
            </tr>
          </thead>
          <tbody className="table-body divide-y divide-neutral-200">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="table-body-cell">
                    <Link 
                      to={`/productos/${transaction.productId}`}
                      className="text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {transaction.productName}
                    </Link>
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
                  <td className="table-body-cell">
                    {transaction.userName}
                  </td>
                  <td className="table-body-cell text-neutral-500">
                    {formatDistanceToNow(new Date(transaction.date), { 
                      addSuffix: true,
                      locale: es
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="table-body-cell text-center py-4 text-neutral-500">
                  No hay transacciones recientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
import { Product, Supplier, InventoryTransaction, Notification, ProductCategory } from '../types';
import { addDays, subDays, format } from 'date-fns';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

// Get a random date within the last 30 days
const getRandomRecentDate = () => {
  const daysAgo = Math.floor(Math.random() * 30);
  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd\'T\'HH:mm:ss');
};

// Current date formatted
const now = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss');

// Product Categories
export const categories: ProductCategory[] = [
  { 
    id: 'cat-1', 
    name: 'Flores Frescas', 
    description: 'Flores recién cortadas para arreglos y ramos' 
  },
  { 
    id: 'cat-2', 
    name: 'Plantas de Interior', 
    description: 'Plantas decorativas para espacios interiores' 
  },
  { 
    id: 'cat-3', 
    name: 'Plantas de Exterior', 
    description: 'Plantas resistentes para jardines y exteriores' 
  },
  { 
    id: 'cat-4', 
    name: 'Arreglos Florales', 
    description: 'Composiciones florales para ocasiones especiales' 
  },
  { 
    id: 'cat-5', 
    name: 'Accesorios', 
    description: 'Complementos para arreglos y cuidado de plantas' 
  },
];

// Suppliers
export const suppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Jardines del Valle S.A.C.',
    contactName: 'María Sánchez',
    email: 'contacto@jardinesvalle.com.pe',
    phone: '(+51) 1 234 5678',
    address: 'Av. La Marina 1234, San Miguel, Lima',
    rating: 4.8,
    notes: 'Excelente proveedor de flores exóticas. Entrega puntual.',
    createdAt: subDays(now, 120),
    updatedAt: now,
  },
  {
    id: 'sup-2',
    name: 'Viveros Santa Rosa',
    contactName: 'José Martínez',
    email: 'pedidos@viverossantarosa.com.pe',
    phone: '(+51) 1 567 8901',
    address: 'Jr. Los Jardines 456, La Molina, Lima',
    rating: 4.5,
    notes: 'Especialistas en plantas de interior y exterior.',
    createdAt: subDays(now, 90),
    updatedAt: subDays(now, 5),
  },
  {
    id: 'sup-3',
    name: 'Flores del Perú',
    contactName: 'Ana Pérez',
    email: 'info@floresdelperu.com.pe',
    phone: '(+51) 1 678 1234',
    address: 'Av. Primavera 789, Surco, Lima',
    rating: 4.3,
    notes: 'Gran variedad de flores nacionales e importadas.',
    createdAt: subDays(now, 80),
    updatedAt: subDays(now, 10),
  },
  {
    id: 'sup-4',
    name: 'Distribuidora Floral Lima',
    contactName: 'Javier López',
    email: 'ventas@distflorallima.com.pe',
    phone: '(+51) 1 789 2345',
    address: 'Jr. Las Orquídeas 123, Miraflores, Lima',
    rating: 4.0,
    notes: 'Buenos precios en flores de temporada.',
    createdAt: subDays(now, 75),
    updatedAt: subDays(now, 20),
  },
];

// Products
export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Rosa Roja Premium',
    code: 'RR-001',
    category: 'Flores Frescas',
    supplier: 'Jardines del Valle S.A.C.',
    supplierID: 'sup-1',
    purchasePrice: 4.50,
    salePrice: 9.90,
    stock: 150,
    minStockLevel: 50,
    createdAt: subDays(now, 60),
    updatedAt: now,
    imageUrl: 'https://i.pinimg.com/736x/c5/40/91/c540917ad1a3e272c87c5cfc3b4f64d0.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'prod-2',
    name: 'Orquídea Phalaenopsis',
    code: 'OP-002',
    category: 'Plantas de Interior',
    supplier: 'Viveros Santa Rosa',
    supplierID: 'sup-2',
    purchasePrice: 45.00,
    salePrice: 89.90,
    stock: 35,
    minStockLevel: 10,
    createdAt: subDays(now, 55),
    updatedAt: subDays(now, 2),
    imageUrl: 'https://i.pinimg.com/736x/66/93/45/669345fe383cef93133b13698204dfdb.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'prod-3',
    name: 'Tulipán Holandés',
    code: 'TH-003',
    category: 'Flores Frescas',
    supplier: 'Flores del Perú',
    supplierID: 'sup-3',
    purchasePrice: 3.50,
    salePrice: 7.90,
    stock: 200,
    minStockLevel: 75,
    createdAt: subDays(now, 50),
    updatedAt: subDays(now, 5),
    imageUrl: 'https://i.pinimg.com/736x/6b/26/d7/6b26d77a8ea2bb06c395c721ede3af10.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'prod-4',
    name: 'Bonsái Ficus',
    code: 'BF-004',
    category: 'Plantas de Interior',
    supplier: 'Viveros Santa Rosa',
    supplierID: 'sup-2',
    purchasePrice: 89.90,
    salePrice: 179.90,
    stock: 15,
    minStockLevel: 5,
    createdAt: subDays(now, 45),
    updatedAt: subDays(now, 10),
    imageUrl: 'https://i.pinimg.com/736x/7d/c7/eb/7dc7eb5690f636edc0d23ecf617fae6a.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'prod-5',
    name: 'Girasol Grande',
    code: 'GG-005',
    category: 'Flores Frescas',
    supplier: 'Distribuidora Floral Lima',
    supplierID: 'sup-4',
    purchasePrice: 5.90,
    salePrice: 12.90,
    stock: 80,
    minStockLevel: 30,
    createdAt: subDays(now, 40),
    updatedAt: subDays(now, 3),
    imageUrl: 'https://i.pinimg.com/736x/07/cc/d3/07ccd3deae5e04c09fb5ad283976feee.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'prod-6',
    name: 'Jazmín Estrella',
    code: 'JE-006',
    category: 'Plantas de Exterior',
    supplier: 'Viveros Santa Rosa',
    supplierID: 'sup-2',
    purchasePrice: 29.90,
    salePrice: 59.90,
    stock: 25,
    minStockLevel: 10,
    createdAt: subDays(now, 35),
    updatedAt: subDays(now, 7),
    imageUrl: 'https://i.pinimg.com/736x/7b/eb/c3/7bebc3065e0f45212c4292623cbb1436.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'prod-7',
    name: 'Ramo de Novia Clásico',
    code: 'RN-007',
    category: 'Arreglos Florales',
    supplier: 'Jardines del Valle S.A.C.',
    supplierID: 'sup-1',
    purchasePrice: 149.90,
    salePrice: 299.90,
    stock: 8,
    minStockLevel: 3,
    createdAt: subDays(now, 30),
    updatedAt: now,
    imageUrl: 'https://i.pinimg.com/736x/49/db/53/49db53888beb9e47c001ba3418506c51.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'prod-8',
    name: 'Maceta Decorativa',
    code: 'MD-008',
    category: 'Accesorios',
    supplier: 'Distribuidora Floral Lima',
    supplierID: 'sup-4',
    purchasePrice: 19.90,
    salePrice: 39.90,
    stock: 40,
    minStockLevel: 15,
    createdAt: subDays(now, 25),
    updatedAt: subDays(now, 1),
    imageUrl: 'https://i.pinimg.com/736x/15/e6/9f/15e69fac245bfc353dca054dd4c2fd40.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'prod-9',
    name: 'Suculenta Variada',
    code: 'SV-009',
    category: 'Plantas de Interior',
    supplier: 'Viveros Santa Rosa',
    supplierID: 'sup-2',
    purchasePrice: 14.90,
    salePrice: 29.90,
    stock: 60,
    minStockLevel: 20,
    createdAt: subDays(now, 20),
    updatedAt: subDays(now, 4),
    imageUrl: 'https://i.pinimg.com/736x/bd/2a/f1/bd2af172616ff22e37b243ffbc4c6d1b.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'prod-10',
    name: 'Fertilizante Universal',
    code: 'FU-010',
    category: 'Accesorios',
    supplier: 'Distribuidora Floral Lima',
    supplierID: 'sup-4',
    purchasePrice: 15.90,
    salePrice: 34.90,
    stock: 5,
    minStockLevel: 20,
    createdAt: subDays(now, 15),
    updatedAt: subDays(now, 2),
    imageUrl: 'https://i.pinimg.com/736x/12/2f/b2/122fb2053a2029c8d0ca7f22835746bf.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

// Generate inventory transactions
export const inventoryTransactions: InventoryTransaction[] = [];

// Generate a mix of entries and exits for each product
products.forEach(product => {
  // Generate between 3-8 transactions for each product
  const numTransactions = 3 + Math.floor(Math.random() * 6);
  
  for (let i = 0; i < numTransactions; i++) {
    const isEntry = Math.random() > 0.4; // 60% chance of being an entry
    const quantity = isEntry 
      ? 5 + Math.floor(Math.random() * 20)
      : 1 + Math.floor(Math.random() * 5);
    
    const previousStock = Math.max(0, product.stock - (isEntry ? quantity : 0));
    const newStock = isEntry 
      ? previousStock + quantity
      : previousStock - quantity;
    
    // Only add valid exits (where there's enough stock)
    if (isEntry || previousStock >= quantity) {
      inventoryTransactions.push({
        id: `trans-${generateId()}`,
        productId: product.id,
        productName: product.name,
        type: isEntry ? 'entry' : 'exit',
        quantity,
        previousStock,
        newStock,
        date: getRandomRecentDate(),
        userId: generateId(),
        userName: 'Sistema',
        notes: isEntry 
          ? 'Reposición de inventario'
          : 'Venta al cliente',
      });
    }
  }
});

// Sort transactions by date (newest first)
inventoryTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Notifications
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'low_stock',
    message: 'Fertilizante Universal está por debajo del nivel mínimo de stock',
    read: false,
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    productId: 'prod-10',
    link: '/productos/prod-10',
  },
  {
    id: 'notif-2',
    type: 'inventory_movement',
    message: 'Gran entrada de inventario: 50 unidades de Rosa Roja Premium',
    read: true,
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    productId: 'prod-1',
    link: '/inventario',
  },
  {
    id: 'notif-3',
    type: 'system',
    message: 'El reporte mensual de inventario está disponible',
    read: false,
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    link: '/reportes',
  },
  {
    id: 'notif-4',
    type: 'restock_alert',
    message: 'Es momento de reabastecer Bonsái Ficus (stock actual: 15)',
    read: false,
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    productId: 'prod-4',
    link: '/productos/prod-4',
  },
];

// Helper to calculate total inventory value
export const calculateInventoryValue = () => {
  return products.reduce((total, product) => {
    return total + (product.purchasePrice * product.stock);
  }, 0);
};

// Helper to get low stock products
export const getLowStockProducts = () => {
  return products.filter(product => product.stock <= product.minStockLevel);
};

// Helper to get top selling products
export const getTopSellingProducts = () => {
  const productSales: Record<string, number> = {};
  
  // Count exits for each product
  inventoryTransactions.forEach(transaction => {
    if (transaction.type === 'exit') {
      if (!productSales[transaction.productId]) {
        productSales[transaction.productId] = 0;
      }
      productSales[transaction.productId] += transaction.quantity;
    }
  });
  
  // Convert to array and sort
  const topProducts = Object.entries(productSales)
    .map(([productId, quantitySold]) => {
      const product = products.find(p => p.id === productId);
      return {
        productId,
        productName: product ? product.name : 'Unknown Product',
        quantitySold,
      };
    })
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5);
  
  return topProducts;
};

// Helper to get stock distribution by category
export const getStockDistribution = () => {
  const categoryStock: Record<string, number> = {};
  
  // Sum stock for each category
  products.forEach(product => {
    if (!categoryStock[product.category]) {
      categoryStock[product.category] = 0;
    }
    categoryStock[product.category] += product.stock;
  });
  
  // Convert to array
  return Object.entries(categoryStock).map(([category, value]) => ({
    category,
    value,
  }));
};

// Dashboard summary
export const getDashboardSummary = () => {
  return {
    totalProducts: products.length,
    lowStockProducts: getLowStockProducts().length,
    totalSuppliers: suppliers.length,
    inventoryValue: calculateInventoryValue(),
    recentTransactions: inventoryTransactions.slice(0, 5),
    topSellingProducts: getTopSellingProducts(),
    stockDistribution: getStockDistribution(),
  };
};
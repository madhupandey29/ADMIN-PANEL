"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Typography, Button, Box, Chip, CircularProgress, Avatar, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { apiFetch } from '../../utils/apiFetch';
import { EnhancedDataTable } from '@/components';
import type { Column } from '@/components';
import OrderFormDialog from './OrderFormDialog';
import OrderViewDialog from './OrderViewDialog';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image1?: string;
  image2?: string;
  img?: string;
  images?: string[];
  description?: string;
  color?: string[];
  size?: string;
  sku?: string;
}

interface Order {
  _id?: string;
  firstName: string;
  lastName: string;
  country: string;
  streetAddress?: string;
  city?: string;
  postcode?: string;
  phone: string;
  email: string;
  shippingInstructions?: string;
  total: number;
  payment: 'cod' | 'online' | 'wallet' | 'card' | 'upi';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  discount?: number;
  shipping: 'standard' | 'express' | 'overnight';
  shippingCost: number;
  userId: string;
  products?: OrderItem[];
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Permission function matching products page
function getOrderPagePermission() {
  if (typeof window === 'undefined') return 'no access';
  const email = localStorage.getItem('admin-email');
  const superAdmin = process.env.NEXT_PUBLIC_SUPER_ADMIN;
  if (email && superAdmin && email === superAdmin) return 'all access';
  const perms = JSON.parse(localStorage.getItem('admin-permissions') || '{}');
  if (perms && perms.product) {
    return perms.product;
  }
  return 'no access';
}

// Define interface for raw order data from API
interface OrderData {
  _id: string | { $oid: string };
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  total: number;
  payment: string;
  paymentStatus: string;
  shipping: string;
  shippingCost: number;
  productId: Array<string | {
    _id: string;
    name: string;
    price: number;
    image1?: string;
    images?: string[];
  }>;
  quantity?: number[];
  price?: number[];
  userId?: string | { _id: string; name: string; email: string; phone?: string; address?: string };
  streetAddress?: string;
  city?: string;
  country?: string;
  createdAt?: { $date: string } | string;
  updatedAt?: { $date: string } | string;
}

export default function OrdersPage() {
  const [pageAccess, setPageAccess] = useState<'all access' | 'only view' | 'no access'>('no access');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Order>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPageAccess(getOrderPagePermission());
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching orders from:', '/orders');
      const response = await apiFetch('/orders');
      const result = await response.json();
      console.log('API Response:', result);
      
      // Check if we have a valid response with data
      if (result && result.status === 'success' && result.data?.orders) {
        const ordersData = Array.isArray(result.data.orders) ? result.data.orders : [result.data.orders];
        console.log('Raw orders data:', ordersData);
        
        // Transform the data to include product and user details
        const ordersWithDetails = await Promise.all(ordersData.map(async (order: OrderData) => {
          try {
            // Extract product details - handle both string IDs and populated product objects
            const products = [];
            if (Array.isArray(order.productId) && order.productId.length > 0) {
              for (let i = 0; i < order.productId.length; i++) {
                const product = order.productId[i];
                const quantity = order.quantity?.[i] || 0;
                const price = order.price?.[i] || 0;
                
                // If product is a string ID, we need to fetch its details
                if (typeof product === 'string') {
                  try {
                    const productResponse = await apiFetch(`/products/${product}`);
                    const productData = await productResponse.json();
                    if (productData.status === 'success' && productData.data) {
                      const p = productData.data.product || productData.data;
                      products.push({
                        _id: p._id || `unknown-${i}`,
                        name: p.name || 'Product',
                        price: price || p.price || 0,
                        quantity: quantity,
                        total: (price || p.price || 0) * quantity,
                        image1: p.image1 || (p.images?.[0] || ''),
                        img: p.image1 || (p.images?.[0] || '')
                      });
                      continue;
                    }
                  } catch (error) {
                    console.error('Error fetching product details:', error);
                  }
                } else if (typeof product === 'object' && product !== null) {
                  // If product is already an object with product details
                  products.push({
                    _id: product._id || `unknown-${i}`,
                    name: product.name || 'Product',
                    price: price || product.price || 0,
                    quantity: quantity,
                    total: (price || product.price || 0) * quantity,
                    image1: product.image1 || (product.images?.[0] || ''),
                    img: product.image1 || (product.images?.[0] || '')
                  });
                }
              }
            }
            
            // Helper function to handle date conversion
            const parseDate = (dateValue: string | { $date: string } | undefined): string => {
              if (!dateValue) return new Date().toISOString();
              if (typeof dateValue === 'string') return dateValue;
              if (typeof dateValue === 'object' && '$date' in dateValue) {
                return new Date(dateValue.$date).toISOString();
              }
              return new Date().toISOString();
            };

            // Helper function to handle user ID
            const getUserId = (userId: string | { _id: string } | undefined): string => {
              if (!userId) return '';
              if (typeof userId === 'string') return userId;
              return userId._id || '';
            };

            // Helper function to get user info
            const getUserInfo = () => {
              if (!order.userId) return { _id: '', name: 'Unknown', email: '' };
              
              if (typeof order.userId === 'string') {
                return {
                  _id: order.userId,
                  name: `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'Customer',
                  email: order.email || 'no-email@example.com',
                  phone: order.phone || '',
                  address: `${order.streetAddress || ''}, ${order.city || ''} ${order.country || ''}`.trim()
                };
              }
              
              return {
                _id: order.userId._id || '',
                name: order.userId.name || `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'Customer',
                email: order.userId.email || order.email || 'no-email@example.com',
                phone: order.userId.phone || order.phone || '',
                address: order.userId.address || `${order.streetAddress || ''}, ${order.city || ''} ${order.country || ''}`.trim()
              };
            };

            // Format the order data
            const transformedOrder: Order = {
              _id: typeof order._id === 'object' && order._id !== null ? order._id.$oid : (order._id || ''),
              firstName: order.firstName || 'Unknown',
              lastName: order.lastName || 'Customer',
              phone: order.phone || 'N/A',
              email: order.email || 'no-email@example.com',
              total: order.total || 0,
              payment: ((order.payment as string) === 'stripe' || (order.payment as string) === 'paypal' || (order.payment as string) === 'bank' ? 'online' : 'cod') as 'cod' | 'online' | 'wallet' | 'card' | 'upi',
              paymentStatus: ((order.paymentStatus as string) === 'cancelled' ? 'failed' : order.paymentStatus) as 'pending' | 'paid' | 'failed' | 'refunded',
              shipping: (order.shipping as 'standard' | 'express' | 'overnight') || 'standard',
              shippingCost: order.shippingCost || 0,
              products: products,
              userId: getUserId(order.userId),
              user: getUserInfo(),
              country: order.country || '',
              streetAddress: order.streetAddress || '',
              city: order.city || '',
              createdAt: parseDate(order.createdAt),
              updatedAt: parseDate(order.updatedAt)
            };

            console.log('Transformed order:', transformedOrder);
            return transformedOrder;
          } catch (error) {
            console.error('Error processing order:', error, order);
            return null;
          }
        }));
        
        // Filter out any null orders that failed processing
        const validOrders = ordersWithDetails.filter((order): order is Order => order !== null);
        console.log('Setting orders:', validOrders);
        setOrders(validOrders);
      } else {
        console.error('Invalid data format received from API:', result);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pageAccess !== 'no access') {
      fetchOrders();
    }
  }, [fetchOrders, pageAccess]);

  // Define columns for EnhancedDataTable
  const columns: Column<Order>[] = useMemo(() => [
    {
      id: '_id',
      label: 'Order ID',
      sortable: true,
      filterable: true,
      format: (value, order) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main', fontFamily: 'monospace' }}>
          #{order._id?.substring(0, 8).toUpperCase()}
        </Typography>
      ),
    },
    {
      id: 'firstName',
      label: 'Customer',
      sortable: true,
      filterable: true,
      format: (value, order) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>
            {order.firstName?.charAt(0)}{order.lastName?.charAt(0) || '?'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {`${order.firstName} ${order.lastName}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {order.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'createdAt',
      label: 'Date',
      sortable: true,
      filterable: true,
      format: (value, order) => (
        <Box>
          <Typography variant="body2">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ''}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'products',
      label: 'Products',
      format: (value, order) => {
        if (!order.products || order.products.length === 0) {
          return <Typography variant="body2" color="text.secondary">No products</Typography>;
        }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box 
              component="img"
              src={order.products[0].img || order.products[0].image1 || '/placeholder-product.png'}
              alt={order.products[0].name}
              sx={{ 
                width: 40, 
                height: 40, 
                objectFit: 'cover',
                borderRadius: 1,
                border: '1px solid #eee'
              }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {order.products[0].name}
              </Typography>
              {order.products.length > 1 && (
                <Typography variant="caption" color="text.secondary">
                  +{order.products.length - 1} more
                </Typography>
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      id: 'total',
      label: 'Total',
      sortable: true,
      filterable: true,
      align: 'right',
      format: (value, order) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          ${order.total?.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 'payment',
      label: 'Payment',
      sortable: true,
      filterable: true,
      format: (value, order) => (
        <Chip 
          label={order.payment?.toUpperCase() || 'N/A'} 
          size="small" 
          variant="outlined"
          sx={{
            textTransform: 'capitalize',
            borderColor: order.paymentStatus === 'paid' ? 'success.main' : 'default',
            color: order.paymentStatus === 'paid' ? 'success.main' : 'inherit',
          }}
        />
      ),
    },
    {
      id: 'paymentStatus',
      label: 'Status',
      sortable: true,
      filterable: true,
      format: (value, order) => (
        <Chip
          label={order.paymentStatus?.toUpperCase() || 'N/A'}
          size="small"
          color={
            order.paymentStatus === 'paid' ? 'success' :
            order.paymentStatus === 'failed' ? 'error' :
            order.paymentStatus === 'refunded' ? 'default' : 'warning'
          }
        />
      ),
    },
  ], []);

  // Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.paymentStatus === 'pending').length;
    const paid = orders.filter(o => o.paymentStatus === 'paid').length;
    const failed = orders.filter(o => o.paymentStatus === 'failed').length;
    const refunded = orders.filter(o => o.paymentStatus === 'refunded').length;

    return { total, pending, paid, failed, refunded };
  }, [orders]);

  const handleAdd = useCallback(() => {
    setForm({
      firstName: '',
      lastName: '',
      country: 'India',
      streetAddress: '',
      city: '',
      postcode: '',
      phone: '',
      email: '',
      shippingInstructions: '',
      total: 0,
      payment: 'cod',
      paymentStatus: 'pending',
      discount: 0,
      shipping: 'standard',
      shippingCost: 0,
      userId: '',
      products: [],
    });
    setEditId(null);
    setOpen(true);
  }, []);

  const handleEdit = useCallback((order: Order) => {
    setEditId(order._id as string);
    setForm(order);
    setOpen(true);
  }, []);

  const handleView = useCallback((order: Order) => {
    setSelectedOrder(order);
    setViewOpen(true);
  }, []);

  const handleViewClose = useCallback(() => {
    setViewOpen(false);
    setSelectedOrder(null);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setForm({});
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Prepare the order data
      const orderData = {
        ...form,
        total: Number(form.total) || 0,
        shippingCost: Number(form.shippingCost) || 0,
        discount: Number(form.discount) || 0,
        products: Array.isArray(form.products) ? form.products : []
      };

      const url = editId ? `/orders/${editId}` : `/orders`;
      const method = editId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to save order');
      }

      await fetchOrders();
      handleClose();
      alert(editId ? 'Order updated successfully!' : 'Order created successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('An error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveFromView = useCallback(async (updatedOrder: Order) => {
    try {
      const response = await apiFetch(`/orders/${updatedOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder)
      });

      if (response.ok) {
        await fetchOrders();
        setViewOpen(false);
        setSelectedOrder(null);
        alert('Order updated successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('An error occurred while updating');
    }
  }, [fetchOrders]);

  const handleDelete = useCallback(async (order: Order) => {
    if (!order._id) return;

    if (confirm(`Are you sure you want to delete order #${order._id.substring(0, 8).toUpperCase()}?`)) {
      try {
        await apiFetch(`/orders/${order._id}`, { method: 'DELETE' });
        fetchOrders();
        alert(`Order deleted successfully!`);
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  }, [fetchOrders]);

  const handleExportSelected = useCallback(() => {
    if (selectedOrders.length === 0) return;

    const dataStr = JSON.stringify(selectedOrders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert(`Exported ${selectedOrders.length} orders successfully!`);
  }, [selectedOrders]);

  if (pageAccess === 'no access') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ color: '#e74c3c', mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
          You don&apos;t have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {pageAccess === 'only view' && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ p: 2, bgcolor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 2 }}>
            <Typography color="#ad6800" fontWeight={600}>
              You have view-only access. To make changes, contact your admin.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Header Section */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            📦 Order Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your orders with advanced filtering and sorting
          </Typography>
        </Box>

        {/* Bulk Actions */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleExportSelected}
            disabled={selectedOrders.length === 0 || pageAccess === 'only view'}
          >
            Export ({selectedOrders.length})
          </Button>
          <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={pageAccess === 'only view'}
          >
            Add New Order
          </Button>
        </Box>
      </Box>

      {/* Data Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <EnhancedDataTable
          columns={columns}
          data={orders}
          selectable
          onSelectionChange={setSelectedOrders}
          onEdit={pageAccess === 'only view' ? undefined : handleEdit}
          onDelete={pageAccess === 'only view' ? undefined : handleDelete}
          onView={handleView}
          enableColumnFilters
          enableColumnManagement
          rowsPerPage={15}
          searchPlaceholder="Search by order ID, customer name, email..."
          storageKey="orders-table"
        />
      )}

      {/* Add/Edit Dialog */}
      <OrderFormDialog
        open={open}
        onClose={handleClose}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        editId={editId}
        submitting={submitting}
        pageAccess={pageAccess}
      />

      {/* View Dialog */}
      <OrderViewDialog
        open={viewOpen}
        onClose={handleViewClose}
        order={selectedOrder}
        onSave={handleSaveFromView}
        pageAccess={pageAccess}
      />
    </Box>
  );
}

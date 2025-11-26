"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Button,
  Box, Chip, TextField, FormControl, InputLabel, Select, MenuItem, Divider, Avatar
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image1?: string;
  img?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

interface OrderViewDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (updatedOrder: Order) => Promise<void>;
  pageAccess: string;
}

export default function OrderViewDialog({
  open, onClose, order, onSave, pageAccess
}: OrderViewDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setEditData(order);
    }
  }, [order]);

  if (!order) return null;

  const handleSave = async () => {
    if (!editData) return;
    setSaving(true);
    try {
      await onSave(editData);
      setIsEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(order);
    setIsEditMode(false);
  };

  const currentData = isEditMode ? editData : order;
  if (!currentData) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#f8f9fa',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: isEditMode 
          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2
      }}>
        <Typography variant="h6" fontWeight={700}>
          {isEditMode ? '✏️ Editing' : '👁️ Viewing'}: Order #{order._id?.substring(0, 8).toUpperCase()}
        </Typography>
        <IconButton 
          onClick={onClose}
          sx={{ 
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <ClearIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Customer Information */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="primary">
            👤 Customer Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="First Name *"
                  value={editData?.firstName || ''}
                  onChange={(e) => setEditData({ ...editData!, firstName: e.target.value })}
                  fullWidth
                  required
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>First Name</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.firstName}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Last Name *"
                  value={editData?.lastName || ''}
                  onChange={(e) => setEditData({ ...editData!, lastName: e.target.value })}
                  fullWidth
                  required
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Last Name</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.lastName}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Email *"
                  type="email"
                  value={editData?.email || ''}
                  onChange={(e) => setEditData({ ...editData!, email: e.target.value })}
                  fullWidth
                  required
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Email</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.email}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Phone *"
                  value={editData?.phone || ''}
                  onChange={(e) => setEditData({ ...editData!, phone: e.target.value })}
                  fullWidth
                  required
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Phone</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.phone}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Shipping Address */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="success.main">
            📍 Shipping Address
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Street Address"
                  value={editData?.streetAddress || ''}
                  onChange={(e) => setEditData({ ...editData!, streetAddress: e.target.value })}
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Street Address</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.streetAddress || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="City"
                  value={editData?.city || ''}
                  onChange={(e) => setEditData({ ...editData!, city: e.target.value })}
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>City</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.city || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Country"
                  value={editData?.country || 'India'}
                  onChange={(e) => setEditData({ ...editData!, country: e.target.value })}
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Country</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.country}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Postcode"
                  value={editData?.postcode || ''}
                  onChange={(e) => setEditData({ ...editData!, postcode: e.target.value })}
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Postcode</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.postcode || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Shipping Instructions"
                  value={editData?.shippingInstructions || ''}
                  onChange={(e) => setEditData({ ...editData!, shippingInstructions: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Shipping Instructions</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.shippingInstructions || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Order Details */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="warning.main">
            💰 Order Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Total Amount *"
                  type="number"
                  value={editData?.total || 0}
                  onChange={(e) => setEditData({ ...editData!, total: Number(e.target.value) })}
                  fullWidth
                  required
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Total Amount</Typography>
                  <Typography variant="body2" mt={0.5} fontWeight={600}>${currentData.total?.toFixed(2)}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Discount"
                  type="number"
                  value={editData?.discount || 0}
                  onChange={(e) => setEditData({ ...editData!, discount: Number(e.target.value) })}
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Discount</Typography>
                  <Typography variant="body2" mt={0.5}>${currentData.discount?.toFixed(2) || '0.00'}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <FormControl fullWidth size="small">
                  <InputLabel>Shipping Method</InputLabel>
                  <Select
                    value={editData?.shipping || 'standard'}
                    onChange={(e) => setEditData({ ...editData!, shipping: e.target.value as 'standard' | 'express' | 'overnight' })}
                    label="Shipping Method"
                  >
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="express">Express</MenuItem>
                    <MenuItem value="overnight">Overnight</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Shipping Method</Typography>
                  <Box mt={0.5}>
                    <Chip label={currentData.shipping?.toUpperCase()} size="small" />
                  </Box>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Shipping Cost"
                  type="number"
                  value={editData?.shippingCost || 0}
                  onChange={(e) => setEditData({ ...editData!, shippingCost: Number(e.target.value) })}
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Shipping Cost</Typography>
                  <Typography variant="body2" mt={0.5}>${currentData.shippingCost?.toFixed(2)}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Payment Information */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="error">
            💳 Payment Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Box>
              {isEditMode ? (
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={editData?.payment || 'cod'}
                    onChange={(e) => setEditData({ ...editData!, payment: e.target.value as 'cod' | 'online' | 'wallet' | 'card' | 'upi' })}
                    label="Payment Method"
                  >
                    <MenuItem value="cod">Cash on Delivery</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="wallet">Wallet</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Payment Method</Typography>
                  <Box mt={0.5}>
                    <Chip label={currentData.payment?.toUpperCase()} size="small" variant="outlined" />
                  </Box>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    value={editData?.paymentStatus || 'pending'}
                    onChange={(e) => setEditData({ ...editData!, paymentStatus: e.target.value as 'pending' | 'paid' | 'failed' | 'refunded' })}
                    label="Payment Status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="refunded">Refunded</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Payment Status</Typography>
                  <Box mt={0.5}>
                    <Chip 
                      label={currentData.paymentStatus?.toUpperCase()} 
                      size="small" 
                      color={
                        currentData.paymentStatus === 'paid' ? 'success' :
                        currentData.paymentStatus === 'failed' ? 'error' :
                        currentData.paymentStatus === 'refunded' ? 'default' : 'warning'
                      }
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Products */}
        {currentData.products && currentData.products.length > 0 && (
          <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ color: '#9c27b0' }}>
              📦 Products ({currentData.products.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {currentData.products.map((product, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Box 
                    component="img"
                    src={product.img || product.image1 || '/placeholder-product.png'}
                    alt={product.name}
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid #eee'
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{product.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontFamily: 'monospace' }}>
                      ID: {product._id}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                      <Typography variant="caption">Qty: {product.quantity}</Typography>
                      <Typography variant="caption">Price: ${product.price?.toFixed(2)}</Typography>
                      <Typography variant="caption" fontWeight={600}>Total: ${product.total?.toFixed(2)}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid', borderColor: 'divider' }}>
        {!isEditMode ? (
          <>
            <Button onClick={onClose}>Close</Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditMode(true)}
              disabled={pageAccess === 'only view'}
            >
              Edit
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCancel} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />} 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

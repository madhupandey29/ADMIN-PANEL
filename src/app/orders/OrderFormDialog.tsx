"use client";
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Button,
  Box, TextField, FormControl, InputLabel, Select, MenuItem, Divider
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';

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
}

interface OrderFormDialogProps {
  open: boolean;
  onClose: () => void;
  form: Partial<Order>;
  setForm: (form: Partial<Order>) => void;
  onSubmit: () => Promise<void>;
  editId: string | null;
  submitting: boolean;
  pageAccess: string;
}

export default function OrderFormDialog({
  open, onClose, form, setForm, onSubmit, editId, submitting, pageAccess
}: OrderFormDialogProps) {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2
      }}>
        <Typography variant="h6" fontWeight={700}>
          {editId ? '✏️ Edit Order' : '➕ Add New Order'}
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
            <TextField
              size="small"
              label="First Name *"
              value={form.firstName || ''}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              fullWidth
              required
              disabled={pageAccess === 'only view'}
            />
            
            <TextField
              size="small"
              label="Last Name *"
              value={form.lastName || ''}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              fullWidth
              required
              disabled={pageAccess === 'only view'}
            />
            
            <TextField
              size="small"
              label="Email *"
              type="email"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
              required
              disabled={pageAccess === 'only view'}
            />
            
            <TextField
              size="small"
              label="Phone *"
              value={form.phone || ''}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              fullWidth
              required
              disabled={pageAccess === 'only view'}
            />
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
              <TextField
                size="small"
                label="Street Address"
                value={form.streetAddress || ''}
                onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                fullWidth
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <TextField
              size="small"
              label="City"
              value={form.city || ''}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              fullWidth
              disabled={pageAccess === 'only view'}
            />
            
            <TextField
              size="small"
              label="Country"
              value={form.country || 'India'}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              fullWidth
              disabled={pageAccess === 'only view'}
            />
            
            <TextField
              size="small"
              label="Postcode"
              value={form.postcode || ''}
              onChange={(e) => setForm({ ...form, postcode: e.target.value })}
              fullWidth
              disabled={pageAccess === 'only view'}
            />
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField
                size="small"
                label="Shipping Instructions"
                value={form.shippingInstructions || ''}
                onChange={(e) => setForm({ ...form, shippingInstructions: e.target.value })}
                fullWidth
                multiline
                rows={2}
                disabled={pageAccess === 'only view'}
              />
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
            <TextField
              size="small"
              label="Total Amount *"
              type="number"
              value={form.total || 0}
              onChange={(e) => setForm({ ...form, total: Number(e.target.value) })}
              fullWidth
              required
              disabled={pageAccess === 'only view'}
            />
            
            <TextField
              size="small"
              label="Discount"
              type="number"
              value={form.discount || 0}
              onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
              fullWidth
              disabled={pageAccess === 'only view'}
            />
            
            <FormControl fullWidth size="small">
              <InputLabel>Shipping Method</InputLabel>
              <Select
                value={form.shipping || 'standard'}
                onChange={(e) => setForm({ ...form, shipping: e.target.value as 'standard' | 'express' | 'overnight' })}
                label="Shipping Method"
                disabled={pageAccess === 'only view'}
              >
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="express">Express</MenuItem>
                <MenuItem value="overnight">Overnight</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              size="small"
              label="Shipping Cost"
              type="number"
              value={form.shippingCost || 0}
              onChange={(e) => setForm({ ...form, shippingCost: Number(e.target.value) })}
              fullWidth
              disabled={pageAccess === 'only view'}
            />
          </Box>
        </Box>

        {/* Payment Information */}
        <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="error">
            💳 Payment Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={form.payment || 'cod'}
                onChange={(e) => setForm({ ...form, payment: e.target.value as 'cod' | 'online' | 'wallet' | 'card' | 'upi' })}
                label="Payment Method"
                disabled={pageAccess === 'only view'}
              >
                <MenuItem value="cod">Cash on Delivery</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="wallet">Wallet</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth size="small">
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={form.paymentStatus || 'pending'}
                onChange={(e) => setForm({ ...form, paymentStatus: e.target.value as 'pending' | 'paid' | 'failed' | 'refunded' })}
                label="Payment Status"
                disabled={pageAccess === 'only view'}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={submitting || pageAccess === 'only view'}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

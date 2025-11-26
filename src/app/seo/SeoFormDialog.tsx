"use client";
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Button,
  Box, TextField, Autocomplete, ListItem, ListItemAvatar, ListItemText,
  Avatar, Checkbox, FormControlLabel, Divider
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';

interface SeoFormDialogProps {
  open: boolean;
  onClose: () => void;
  form: any;
  setForm: (form: any) => void;
  onSubmit: () => Promise<void>;
  editId: string | null;
  submitting: boolean;
  pageAccess: string;
  products: any[];
  locations: any[];
  API_URL: string;
}

export default function SeoFormDialog({
  open, onClose, form, setForm, onSubmit, editId, submitting, pageAccess, products, locations, API_URL
}: SeoFormDialogProps) {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xl"
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
          {editId ? '✏️ Edit SEO Entry' : '➕ Add New SEO Entry'}
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
        {/* Basic Information - 6 columns */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="primary">
            📝 Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Autocomplete
              size="small"
              options={products}
              getOptionLabel={(option) => option.name || ''}
              value={products.find(p => p._id === form.product) || null}
              onChange={(_, newValue) => setForm({ ...form, product: newValue?._id || '' })}
              renderOption={(props, option) => (
                <ListItem {...props} key={option._id}>
                  <ListItemAvatar>
                    <Avatar 
                      src={option.img ? `${API_URL}/images/${option.img}` : undefined}
                      sx={{ width: 32, height: 32, bgcolor: '#667eea' }}
                    >
                      {option.name?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={option.name} 
                    secondary={`SKU: ${option.sku || 'N/A'}`}
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                </ListItem>
              )}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Product *" 
                  required
                />
              )}
              disabled={pageAccess === 'only view'}
            />
            
            <Autocomplete
              size="small"
              options={locations}
              getOptionLabel={(option) => option.name || ''}
              value={locations.find(l => l._id === form.location) || null}
              onChange={(_, newValue) => setForm({ ...form, location: newValue?._id || '' })}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Location *" 
                  required
                />
              )}
              disabled={pageAccess === 'only view'}
            />
            
            <TextField
              size="small"
              label="Slug"
              value={form.slug || ''}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              fullWidth
              helperText="URL-friendly identifier"
              disabled={pageAccess === 'only view'}
            />
          </Box>
        </Box>

        {/* SEO Content - 6 columns in one row */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="success.main">
            🔍 SEO Content
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 2 }}>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 2' } }}>
              <TextField
                size="small"
                label="Meta Title"
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                fullWidth
                helperText={`${(form.title || '').length} chars`}
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 2' } }}>
              <TextField
                size="small"
                label="Meta Description"
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                fullWidth
                helperText={`${(form.description || '').length} chars`}
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <TextField
              size="small"
              label="Excerpt"
              value={form.excerpt || ''}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              fullWidth
              helperText="Summary"
              disabled={pageAccess === 'only view'}
            />
            
            <TextField
              size="small"
              label="Keywords"
              value={form.keywords || ''}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              fullWidth
              helperText="Comma-separated"
              disabled={pageAccess === 'only view'}
            />
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 2' } }}>
              <TextField
                size="small"
                label="Canonical URL"
                value={form.canonical_url || ''}
                onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                fullWidth
                helperText="Preferred URL"
                disabled={pageAccess === 'only view'}
              />
            </Box>
          </Box>
        </Box>

        {/* Additional Settings - 6 columns */}
        <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="warning.main">
            ⚙️ Additional Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(form.noindex)}
                  onChange={(e) => setForm({ ...form, noindex: e.target.checked })}
                  disabled={pageAccess === 'only view'}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>No Index</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Prevent indexing
                  </Typography>
                </Box>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(form.nofollow)}
                  onChange={(e) => setForm({ ...form, nofollow: e.target.checked })}
                  disabled={pageAccess === 'only view'}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>No Follow</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Prevent following links
                  </Typography>
                </Box>
              }
            />
            
            <TextField
              size="small"
              label="Priority"
              type="number"
              value={form.priority || ''}
              onChange={(e) => setForm({ ...form, priority: parseFloat(e.target.value) })}
              fullWidth
              slotProps={{
                htmlInput: { min: 0, max: 1, step: 0.1 }
              }}
              helperText="Sitemap priority (0.0 to 1.0)"
              disabled={pageAccess === 'only view'}
            />
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

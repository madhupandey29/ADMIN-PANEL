"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Button,
  Box, Chip, TextField, Autocomplete, ListItem, ListItemAvatar, ListItemText,
  Avatar, Checkbox, FormControlLabel, Divider
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface SeoViewDialogProps {
  open: boolean;
  onClose: () => void;
  seo: any;
  onSave: (updatedSeo: any) => Promise<void>;
  pageAccess: string;
  products: any[];
  locations: any[];
  API_URL: string;
}

export default function SeoViewDialog({
  open, onClose, seo, onSave, pageAccess, products, locations, API_URL
}: SeoViewDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (seo) {
      const data = {
        ...seo,
        product: typeof seo.product === 'object' ? seo.product?._id : seo.product,
        location: typeof seo.location === 'object' ? seo.location?._id : seo.location,
      };
      setEditData(data);
    }
  }, [seo]);

  if (!seo) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(editData);
      setIsEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      ...seo,
      product: typeof seo.product === 'object' ? seo.product?._id : seo.product,
      location: typeof seo.location === 'object' ? seo.location?._id : seo.location,
    });
    setIsEditMode(false);
  };

  const currentData = isEditMode ? editData : seo;
  const productObj = typeof seo.product === 'object' ? seo.product : products.find(p => p._id === seo.product);
  const locationObj = typeof seo.location === 'object' ? seo.location : locations.find(l => l._id === seo.location);

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
          {isEditMode ? '✏️ Editing' : '👁️ Viewing'}: {productObj?.name || 'SEO Entry'}
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
            <Box>
              {isEditMode ? (
                <Autocomplete
                  size="small"
                  options={products}
                  getOptionLabel={(option) => option.name || ''}
                  value={products.find(p => p._id === editData.product) || null}
                  onChange={(_, newValue) => setEditData((prev: any) => ({ ...prev, product: newValue?._id || '' }))}
                  renderOption={(props, option) => (
                    <ListItem {...props} key={option._id}>
                      <ListItemAvatar>
                        <Avatar 
                          src={option.img ? `${API_URL}/images/${option.img}` : undefined}
                          sx={{ width: 32, height: 32 }}
                        >
                          {option.name?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={option.name} secondary={`SKU: ${option.sku || 'N/A'}`} />
                    </ListItem>
                  )}
                  renderInput={(params) => <TextField {...params} label="Product *" required />}
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Product</Typography>
                  <Typography variant="body2" mt={0.5}>{productObj?.name || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <Autocomplete
                  size="small"
                  options={locations}
                  getOptionLabel={(option) => option.name || ''}
                  value={locations.find(l => l._id === editData.location) || null}
                  onChange={(_, newValue) => setEditData((prev: any) => ({ ...prev, location: newValue?._id || '' }))}
                  renderInput={(params) => <TextField {...params} label="Location *" required />}
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Location</Typography>
                  <Typography variant="body2" mt={0.5}>{locationObj?.name || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Slug"
                  value={editData.slug || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, slug: e.target.value }))}
                  fullWidth
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Slug</Typography>
                  <Typography variant="body2" mt={0.5} fontFamily="monospace">{currentData.slug || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
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
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Meta Title"
                  value={editData.title || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, title: e.target.value }))}
                  fullWidth
                  helperText={`${(editData.title || '').length} chars`}
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Meta Title</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.title || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 2' } }}>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Meta Description"
                  value={editData.description || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, description: e.target.value }))}
                  fullWidth
                  helperText={`${(editData.description || '').length} chars`}
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Meta Description</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.description || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Excerpt"
                  value={editData.excerpt || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, excerpt: e.target.value }))}
                  fullWidth
                  helperText="Summary"
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Excerpt</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.excerpt || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Keywords"
                  value={editData.keywords || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, keywords: e.target.value }))}
                  fullWidth
                  helperText="Comma-separated"
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Keywords</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.keywords || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 2' } }}>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Canonical URL"
                  value={editData.canonical_url || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, canonical_url: e.target.value }))}
                  fullWidth
                  helperText="Preferred URL"
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Canonical URL</Typography>
                  <Typography variant="body2" mt={0.5} sx={{ wordBreak: 'break-all' }}>
                    {currentData.canonical_url || 'N/A'}
                  </Typography>
                </Box>
              )}
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
            <Box>
              {isEditMode ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(editData.noindex)}
                      onChange={(e) => setEditData((prev: any) => ({ ...prev, noindex: e.target.checked }))}
                    />
                  }
                  label="No Index"
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Index Status</Typography>
                  <Box mt={0.5}>
                    <Chip 
                      label={currentData.noindex ? 'No Index' : 'Indexed'} 
                      size="small" 
                      color={currentData.noindex ? 'error' : 'success'}
                    />
                  </Box>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(editData.nofollow)}
                      onChange={(e) => setEditData((prev: any) => ({ ...prev, nofollow: e.target.checked }))}
                    />
                  }
                  label="No Follow"
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Follow Status</Typography>
                  <Box mt={0.5}>
                    <Chip 
                      label={currentData.nofollow ? 'No Follow' : 'Follow'} 
                      size="small" 
                      color={currentData.nofollow ? 'error' : 'success'}
                    />
                  </Box>
                </Box>
              )}
            </Box>
            
            <Box>
              {isEditMode ? (
                <TextField
                  size="small"
                  label="Priority"
                  type="number"
                  value={editData.priority || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, priority: parseFloat(e.target.value) }))}
                  fullWidth
                  slotProps={{
                    htmlInput: { min: 0, max: 1, step: 0.1 }
                  }}
                  helperText="0.0 to 1.0"
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Priority</Typography>
                  <Typography variant="body2" mt={0.5}>{currentData.priority || 'N/A'}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
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

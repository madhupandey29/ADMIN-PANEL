"use client";
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Button,
  Box, TextField, Autocomplete, ListItem, ListItemAvatar, ListItemText,
  Avatar, Divider
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

  const readOnly = pageAccess === 'only view';

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
         {editId ? '✏️ Edit Product × Location SEO' : '➕ Add Product × Location SEO'}

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
        {/* Basic Information */}
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
              disabled={readOnly}
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
              disabled={readOnly}
            />
            
            <TextField
              size="small"
              label="Slug"
              value={form.slug || ''}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              fullWidth
              helperText="URL-friendly identifier"
              disabled={readOnly}
            />
          </Box>
        </Box>

        {/* Product × Location Content */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="success.main">
            📄 Product × Location Content
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <TextField
              size="small"
              label="Product Location Title"
              value={form.productlocationtitle || ''}
              onChange={(e) => setForm({ ...form, productlocationtitle: e.target.value })}
              fullWidth
              disabled={readOnly}
            />

            <TextField
              size="small"
              label="Product Location Tagline"
              value={form.productlocationtagline || ''}
              onChange={(e) => setForm({ ...form, productlocationtagline: e.target.value })}
              fullWidth
              disabled={readOnly}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mt: 2 }}>
            <TextField
              size="small"
              label="Description Block 1"
              value={form.productlocationdescription1 || ''}
              onChange={(e) => setForm({ ...form, productlocationdescription1: e.target.value })}
              fullWidth
              multiline
              minRows={3}
              disabled={readOnly}
            />
            <TextField
              size="small"
              label="Description Block 2"
              value={form.productlocationdescription2 || ''}
              onChange={(e) => setForm({ ...form, productlocationdescription2: e.target.value })}
              fullWidth
              multiline
              minRows={3}
              disabled={readOnly}
            />
          </Box>
        </Box>

        {/* SEO Meta (OG + Twitter) */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="secondary">
            🔍 SEO Meta (OG + Twitter)
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            <TextField
              size="small"
              label="Meta Title (Product × Location)"
              value={form.meta_og_twitter_title_product_location || ''}
              onChange={(e) => setForm({ ...form, meta_og_twitter_title_product_location: e.target.value })}
              fullWidth
              helperText={`${(form.meta_og_twitter_title_product_location || '').length} chars`}
              disabled={readOnly}
            />
            
            <TextField
              size="small"
              label="Meta Description (Product × Location)"
              value={form.meta_og_twitter_description_product_location || ''}
              onChange={(e) => setForm({ ...form, meta_og_twitter_description_product_location: e.target.value })}
              fullWidth
              helperText={`${(form.meta_og_twitter_description_product_location || '').length} chars`}
              disabled={readOnly}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mt: 2 }}>
            <TextField
              size="small"
              label="Excerpt"
              value={form.excerpt || ''}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              fullWidth
              helperText="Short summary used in some blocks"
              disabled={readOnly}
            />
            
            <TextField
              size="small"
              label="Keywords"
              value={form.keywords || ''}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              fullWidth
              helperText="Comma-separated"
              disabled={readOnly}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mt: 2 }}>
            <TextField
              size="small"
              label="Canonical URL"
              value={form.canonical_url || ''}
              onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
              fullWidth
              helperText="Preferred URL for search engines"
              disabled={readOnly}
            />
            <TextField
              size="small"
              label="Content Language (contentLanguage)"
              value={form.contentLanguage || ''}
              onChange={(e) => setForm({ ...form, contentLanguage: e.target.value })}
              fullWidth
              placeholder="e.g. en-IN"
              disabled={readOnly}
            />
            <TextField
              size="small"
              label="OG Locale (ogLocale)"
              value={form.ogLocale || ''}
              onChange={(e) => setForm({ ...form, ogLocale: e.target.value })}
              fullWidth
              placeholder="e.g. en_US"
              disabled={readOnly}
            />
          </Box>
        </Box>

        {/* Video & Twitter Player */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="warning.main">
            🎬 Video & Twitter Player
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            <TextField
              size="small"
              label="OG Video URL"
              value={form.ogVideoUrl || ''}
              onChange={(e) => setForm({ ...form, ogVideoUrl: e.target.value })}
              fullWidth
              disabled={readOnly}
            />
            <TextField
              size="small"
              label="OG Video Secure URL (https)"
              value={form.ogVideoSecureUrl || ''}
              onChange={(e) => setForm({ ...form, ogVideoSecureUrl: e.target.value })}
              fullWidth
              disabled={readOnly}
            />
            <TextField
              size="small"
              label="OG Video Type"
              value={form.ogVideoType || ''}
              onChange={(e) => setForm({ ...form, ogVideoType: e.target.value })}
              fullWidth
              placeholder="e.g. video/mp4"
              disabled={readOnly}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mt: 2 }}>
            <TextField
              size="small"
              type="number"
              label="OG Video Width"
              value={form.ogVideoWidth ?? ''}
              onChange={(e) => setForm({ 
                ...form, 
                ogVideoWidth: e.target.value === '' ? undefined : Number(e.target.value) 
              })}
              fullWidth
              disabled={readOnly}
            />
            <TextField
              size="small"
              type="number"
              label="OG Video Height"
              value={form.ogVideoHeight ?? ''}
              onChange={(e) => setForm({ 
                ...form, 
                ogVideoHeight: e.target.value === '' ? undefined : Number(e.target.value) 
              })}
              fullWidth
              disabled={readOnly}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mt: 2 }}>
            <TextField
              size="small"
              label="Twitter Player URL"
              value={form.twitterPlayer || ''}
              onChange={(e) => setForm({ ...form, twitterPlayer: e.target.value })}
              fullWidth
              disabled={readOnly}
            />
            <TextField
              size="small"
              type="number"
              label="Twitter Player Width"
              value={form.twitterPlayerWidth ?? ''}
              onChange={(e) => setForm({ 
                ...form, 
                twitterPlayerWidth: e.target.value === '' ? undefined : Number(e.target.value) 
              })}
              fullWidth
              disabled={readOnly}
            />
            <TextField
              size="small"
              type="number"
              label="Twitter Player Height"
              value={form.twitterPlayerHeight ?? ''}
              onChange={(e) => setForm({ 
                ...form, 
                twitterPlayerHeight: e.target.value === '' ? undefined : Number(e.target.value) 
              })}
              fullWidth
              disabled={readOnly}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              size="small"
              label="Video JSON-LD"
              value={form.VideoJsonLd || ''}
              onChange={(e) => setForm({ ...form, VideoJsonLd: e.target.value })}
              fullWidth
              multiline
              minRows={3}
              helperText="Paste JSON-LD for video schema"
              disabled={readOnly}
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
          disabled={submitting || readOnly}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

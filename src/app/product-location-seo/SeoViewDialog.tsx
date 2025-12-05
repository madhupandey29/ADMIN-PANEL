"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Button,
  Box, TextField, Autocomplete, ListItem, ListItemAvatar, ListItemText,
  Avatar, Chip, Divider
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
         {isEditMode ? '✏️ Editing' : '👁️ Viewing'}: {productObj?.name || 'Product × Location SEO'}

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
                  disabled={readOnly}
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
                  disabled={readOnly}
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
                  disabled={readOnly}
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

        {/* Product × Location Content */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="success.main">
            📄 Product × Location Content
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Product Location Title</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.productlocationtitle || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, productlocationtitle: e.target.value }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.productlocationtitle || 'N/A'}</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Product Location Tagline</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.productlocationtagline || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, productlocationtagline: e.target.value }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.productlocationtagline || 'N/A'}</Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mt: 2 }}>
            {/* Description Block 1 with HTML rendering */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Description Block 1
              </Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.productlocationdescription1 || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, productlocationdescription1: e.target.value }))}
                  fullWidth
                  multiline
                  minRows={3}
                  disabled={readOnly}
                />
              ) : (
                <Box
                  mt={0.5}
                  sx={{ fontSize: '0.875rem', color: 'text.primary' }}
                  // ⬇️ Render HTML from backend
                  dangerouslySetInnerHTML={{ __html: currentData.productlocationdescription1 || '' }}
                />
              )}
            </Box>

            {/* Description Block 2 with HTML rendering */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Description Block 2
              </Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.productlocationdescription2 || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, productlocationdescription2: e.target.value }))}
                  fullWidth
                  multiline
                  minRows={3}
                  disabled={readOnly}
                />
              ) : (
                <Box
                  mt={0.5}
                  sx={{ fontSize: '0.875rem', color: 'text.primary' }}
                  // ⬇️ Render HTML from backend
                  dangerouslySetInnerHTML={{ __html: currentData.productlocationdescription2 || '' }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* SEO Meta (OG + Twitter) */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="secondary">
            🔍 SEO Meta (OG + Twitter)
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Meta Title (Product × Location)</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.meta_og_twitter_title_product_location || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, meta_og_twitter_title_product_location: e.target.value }))}
                  fullWidth
                  helperText={`${(editData.meta_og_twitter_title_product_location || '').length} chars`}
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.meta_og_twitter_title_product_location || 'N/A'}</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Meta Description (Product × Location)</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.meta_og_twitter_description_product_location || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, meta_og_twitter_description_product_location: e.target.value }))}
                  fullWidth
                  helperText={`${(editData.meta_og_twitter_description_product_location || '').length} chars`}
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.meta_og_twitter_description_product_location || 'N/A'}</Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Excerpt</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.excerpt || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, excerpt: e.target.value }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.excerpt || 'N/A'}</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Keywords</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.keywords || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, keywords: e.target.value }))}
                  fullWidth
                  helperText="Comma-separated"
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.keywords || 'N/A'}</Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Canonical URL</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.canonical_url || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, canonical_url: e.target.value }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5} sx={{ wordBreak: 'break-all' }}>
                  {currentData.canonical_url || 'N/A'}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Content Language</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.contentLanguage || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, contentLanguage: e.target.value }))}
                  fullWidth
                  placeholder="e.g. en-IN"
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.contentLanguage || 'N/A'}</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>OG Locale</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.ogLocale || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, ogLocale: e.target.value }))}
                  fullWidth
                  placeholder="e.g. en_US"
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.ogLocale || 'N/A'}</Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Video & Twitter Player */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="warning.main">
            🎬 Video & Twitter Player
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* OG Video URLs */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>OG Video URL</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.ogVideoUrl || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, ogVideoUrl: e.target.value }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5} sx={{ wordBreak: 'break-all' }}>
                  {currentData.ogVideoUrl || 'N/A'}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>OG Video Secure URL</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.ogVideoSecureUrl || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, ogVideoSecureUrl: e.target.value }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5} sx={{ wordBreak: 'break-all' }}>
                  {currentData.ogVideoSecureUrl || 'N/A'}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>OG Video Type</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.ogVideoType || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, ogVideoType: e.target.value }))}
                  fullWidth
                  placeholder="e.g. video/mp4"
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.ogVideoType || 'N/A'}</Typography>
              )}
            </Box>
          </Box>

          {/* OG Video dimensions */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>OG Video Width</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  type="number"
                  value={editData.ogVideoWidth ?? ''}
                  onChange={(e) => setEditData((prev: any) => ({ 
                    ...prev, 
                    ogVideoWidth: e.target.value === '' ? undefined : Number(e.target.value) 
                  }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.ogVideoWidth ?? 'N/A'}</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>OG Video Height</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  type="number"
                  value={editData.ogVideoHeight ?? ''}
                  onChange={(e) => setEditData((prev: any) => ({ 
                    ...prev, 
                    ogVideoHeight: e.target.value === '' ? undefined : Number(e.target.value) 
                  }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.ogVideoHeight ?? 'N/A'}</Typography>
              )}
            </Box>
          </Box>

          {/* Twitter Player */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Twitter Player URL</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  value={editData.twitterPlayer || ''}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, twitterPlayer: e.target.value }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5} sx={{ wordBreak: 'break-all' }}>
                  {currentData.twitterPlayer || 'N/A'}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Twitter Player Width</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  type="number"
                  value={editData.twitterPlayerWidth ?? ''}
                  onChange={(e) => setEditData((prev: any) => ({ 
                    ...prev, 
                    twitterPlayerWidth: e.target.value === '' ? undefined : Number(e.target.value) 
                  }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.twitterPlayerWidth ?? 'N/A'}</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>Twitter Player Height</Typography>
              {isEditMode ? (
                <TextField
                  size="small"
                  type="number"
                  value={editData.twitterPlayerHeight ?? ''}
                  onChange={(e) => setEditData((prev: any) => ({ 
                    ...prev, 
                    twitterPlayerHeight: e.target.value === '' ? undefined : Number(e.target.value) 
                  }))}
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <Typography variant="body2" mt={0.5}>{currentData.twitterPlayerHeight ?? 'N/A'}</Typography>
              )}
            </Box>
          </Box>

          {/* Video JSON-LD */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>Video JSON-LD</Typography>
            {isEditMode ? (
              <TextField
                size="small"
                value={editData.VideoJsonLd || ''}
                onChange={(e) => setEditData((prev: any) => ({ ...prev, VideoJsonLd: e.target.value }))}
                fullWidth
                multiline
                minRows={3}
                disabled={readOnly}
              />
            ) : (
              <Typography variant="body2" mt={0.5} sx={{ whiteSpace: 'pre-wrap' }}>
                {currentData.VideoJsonLd || 'N/A'}
              </Typography>
            )}
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

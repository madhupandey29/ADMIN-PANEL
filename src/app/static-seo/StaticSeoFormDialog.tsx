"use client";
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Button,
  Box, TextField, Autocomplete, Chip, FormControl, InputLabel, Select, MenuItem, Divider
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';

interface StaticSeoFormDialogProps {
  open: boolean;
  onClose: () => void;
  form: any;
  setForm: (form: any) => void;
  onSubmit: () => Promise<void>;
  editId: string | null;
  submitting: boolean;
  pageAccess: string;
  availableProductTags: string[];
}

export default function StaticSeoFormDialog({
  open, onClose, form, setForm, onSubmit, editId, submitting, pageAccess, availableProductTags
}: StaticSeoFormDialogProps) {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  const updateNestedField = (path: string, value: any) => {
    const keys = path.split('.');
    const newForm = { ...form };
    let current: any = newForm;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
      
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        if (!current[arrayName]) current[arrayName] = [];
        if (!current[arrayName][index]) current[arrayName][index] = {};
        current = current[arrayName][index];
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    }
    
    const lastKey = keys[keys.length - 1];
    const arrayMatch = lastKey.match(/(\w+)\[(\d+)\]/);
    
    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const index = parseInt(arrayMatch[2]);
      if (!current[arrayName]) current[arrayName] = [];
      current[arrayName][index] = value;
    } else {
      current[lastKey] = value;
    }
    
    setForm(newForm);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => {
      const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        return current?.[arrayName]?.[index];
      }
      return current?.[key];
    }, obj);
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
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 2 }}>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 2', lg: 'span 2' } }}>
              <TextField
                size="small"
                label="Name *"
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth
                required
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 1', lg: 'span 2' } }}>
              <TextField
                size="small"
                label="Slug"
                value={form.slug || ''}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                fullWidth
                helperText="URL-friendly"
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 1', lg: 'span 2' } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={form.status || 'draft'}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  label="Status"
                  disabled={pageAccess === 'only view'}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 3' } }}>
              <TextField
                size="small"
                label="Meta Title"
                value={form.meta_title || ''}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                fullWidth
                helperText={`${(form.meta_title || '').length} chars`}
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 3' } }}>
              <TextField
                size="small"
                label="Content Language"
                value={form.contentLanguage || ''}
                onChange={(e) => setForm({ ...form, contentLanguage: e.target.value })}
                fullWidth
                placeholder="e.g., en"
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 6' } }}>
              <TextField
                size="small"
                label="Meta Description"
                value={form.meta_description || ''}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                fullWidth
                multiline
                rows={2}
                helperText={`${(form.meta_description || '').length} chars`}
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 2', lg: 'span 3' } }}>
              <TextField
                size="small"
                label="Keywords"
                value={form.keywords || ''}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                fullWidth
                helperText="Comma-separated"
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 1', lg: 'span 3' } }}>
              <TextField
                size="small"
                label="Canonical URL"
                value={form.canonical_url || ''}
                onChange={(e) => setForm({ ...form, canonical_url: e.target.value })}
                fullWidth
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 6' } }}>
              <TextField
                size="small"
                label="Excerpt"
                value={form.excerpt || ''}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                fullWidth
                multiline
                rows={2}
                helperText="Summary"
                disabled={pageAccess === 'only view'}
              />
            </Box>
          </Box>
        </Box>

        {/* Product Tags - 6 columns */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="success.main">
            🏷️ Product Tags
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Autocomplete
            multiple
            size="small"
            options={availableProductTags}
            value={Array.isArray(form.producttag) ? form.producttag : (form.producttag ? [form.producttag] : [])}
            onChange={(_, newValue) => setForm({ ...form, producttag: newValue })}
            renderInput={(params) => <TextField {...params} label="Product Tags" />}
            renderTags={(value: unknown[], getTagProps) =>
              value.map((option: unknown, index: number) => (
                <Chip {...getTagProps({ index })} key={String(option)} label={String(option)} size="small" />
              ))
            }
            disabled={pageAccess === 'only view'}
          />
        </Box>

        {/* Description HTML */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="info.main">
            📄 Description HTML
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TextField
            size="small"
            label="Description HTML"
            value={form.description_html || ''}
            onChange={(e) => setForm({ ...form, description_html: e.target.value })}
            fullWidth
            multiline
            rows={4}
            disabled={pageAccess === 'only view'}
          />
        </Box>

        {/* OpenGraph & Twitter - 6 columns */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="warning.main">
            🌐 OpenGraph & Twitter
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 2 }}>
            <TextField
              size="small"
              label="OG Locale"
              value={form.ogLocale || ''}
              onChange={(e) => setForm({ ...form, ogLocale: e.target.value })}
              fullWidth
              placeholder="e.g., en_US"
              disabled={pageAccess === 'only view'}
            />
            
            <TextField
              size="small"
              label="OG Type"
              value={form.ogType || ''}
              onChange={(e) => setForm({ ...form, ogType: e.target.value })}
              fullWidth
              placeholder="e.g., website"
              disabled={pageAccess === 'only view'}
            />
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 1', lg: 'span 2' } }}>
              <TextField
                size="small"
                label="Twitter Card"
                value={form.twitterCard || ''}
                onChange={(e) => setForm({ ...form, twitterCard: e.target.value })}
                fullWidth
                placeholder="e.g., summary_large_image"
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 2' } }}>
              <TextField
                size="small"
                label="OG Image URL"
                value={getNestedValue(form, 'openGraph.images[0]') || ''}
                onChange={(e) => updateNestedField('openGraph.images[0]', e.target.value)}
                fullWidth
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 3' } }}>
              <TextField
                size="small"
                label="OG/Twitter Title"
                value={form.og_twitter_Title || ''}
                onChange={(e) => setForm({ ...form, og_twitter_Title: e.target.value })}
                fullWidth
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 3', lg: 'span 3' } }}>
              <TextField
                size="small"
                label="OG/Twitter Description"
                value={form.og_twitter_Description || ''}
                onChange={(e) => setForm({ ...form, og_twitter_Description: e.target.value })}
                fullWidth
                disabled={pageAccess === 'only view'}
              />
            </Box>
          </Box>
        </Box>

        {/* OpenGraph Video - 6 columns */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="secondary">
            🎥 OpenGraph Video
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 2 }}>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 2', lg: 'span 2' } }}>
              <TextField
                size="small"
                label="Video URL"
                value={getNestedValue(form, 'openGraph.video.url') || ''}
                onChange={(e) => updateNestedField('openGraph.video.url', e.target.value)}
                fullWidth
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 2', lg: 'span 2' } }}>
              <TextField
                size="small"
                label="Video Secure URL"
                value={getNestedValue(form, 'openGraph.video.secure_url') || ''}
                onChange={(e) => updateNestedField('openGraph.video.secure_url', e.target.value)}
                fullWidth
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <TextField
              size="small"
              label="Video Type"
              value={getNestedValue(form, 'openGraph.video.type') || ''}
              onChange={(e) => updateNestedField('openGraph.video.type', e.target.value)}
              fullWidth
              placeholder="e.g., video/mp4"
              disabled={pageAccess === 'only view'}
            />
            
            <TextField
              size="small"
              label="Video Width"
              type="number"
              value={getNestedValue(form, 'openGraph.video.width') || ''}
              onChange={(e) => updateNestedField('openGraph.video.width', Number(e.target.value))}
              fullWidth
              disabled={pageAccess === 'only view'}
            />
          </Box>
        </Box>

        {/* Twitter Details - 6 columns */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} color="error">
            🐦 Twitter Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 2 }}>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 2', lg: 'span 3' } }}>
              <TextField
                size="small"
                label="Twitter Image URL"
                value={getNestedValue(form, 'twitter.image') || ''}
                onChange={(e) => updateNestedField('twitter.image', e.target.value)}
                fullWidth
                disabled={pageAccess === 'only view'}
              />
            </Box>
            
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2', md: 'span 1', lg: 'span 3' } }}>
              <TextField
                size="small"
                label="Twitter Player URL"
                value={getNestedValue(form, 'twitter.player') || ''}
                onChange={(e) => updateNestedField('twitter.player', e.target.value)}
                fullWidth
                disabled={pageAccess === 'only view'}
              />
            </Box>
          </Box>
        </Box>

        {/* Structured Data */}
        <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ color: '#9c27b0' }}>
            📊 Structured Data (JSON-LD)
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TextField
            size="small"
            label="Video JSON-LD"
            value={form.VideoJsonLd || ''}
            onChange={(e) => setForm({ ...form, VideoJsonLd: e.target.value })}
            fullWidth
            multiline
            rows={4}
            disabled={pageAccess === 'only view'}
          />
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

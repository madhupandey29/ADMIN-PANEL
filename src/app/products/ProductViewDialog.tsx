"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog, AppBar, Toolbar, IconButton, Typography, Button, DialogContent,
  Box, Chip, TextField, FormControl, InputLabel, Select, MenuItem,
  Checkbox, FormControlLabel
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Image from 'next/image';

interface ProductViewDialogProps {
  open: boolean;
  onClose: () => void;
  product: any;
  onSave: (updatedProduct: any) => Promise<void>;
  getImageUrl: (img: string | undefined) => string | undefined;
  pageAccess: string;
  dropdowns: any;
}

export default function ProductViewDialog({
  open, onClose, product, onSave, getImageUrl, pageAccess, dropdowns
}: ProductViewDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      // Helper to extract ID from field
      const getId = (field: any): string => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (field && typeof field === 'object' && '_id' in field) return field._id;
        return '';
      };

      // Process product data to extract IDs for dropdowns
      const processedData = {
        ...product,
        category: getId(product.category),
        substructure: getId(product.substructure),
        content: getId(product.content),
        design: getId(product.design),
        subfinish: getId(product.subfinish),
        vendor: getId(product.vendor),
        groupcode: getId(product.groupcode),
        motif: getId(product.motif),
        um: getId(product.um),
        currency: getId(product.currency),
        // Ensure arrays are properly formatted
        color: Array.isArray(product.color) 
          ? product.color.map((c: any) => getId(c))
          : [getId(product.color)],
        subsuitable: Array.isArray(product.subsuitable) 
          ? product.subsuitable 
          : [],
        leadtime: Array.isArray(product.leadtime) 
          ? product.leadtime 
          : [],
      };
      
      setEditData(processedData);
    }
  }, [product]);

  if (!product) return null;

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
    setEditData(product);
    setIsEditMode(false);
  };

  const currentData = isEditMode ? editData : product;

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: 'relative', bgcolor: '#2c3e50' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <ClearIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2, flex: 1 }}>
            {product.img && (
              <Box sx={{ width: 50, height: 50, position: 'relative', borderRadius: 1, overflow: 'hidden', border: '2px solid white' }}>
                <Image src={getImageUrl(product.img) || ''} alt={product.name} fill style={{ objectFit: 'cover' }} />
              </Box>
            )}
            <Box>
              <Typography variant="h6" fontWeight={600} color="white">
                {isEditMode ? '✏️ Editing' : '👁️ Viewing'}: {product.name}
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.8)">SKU: {product.sku || 'N/A'} • ID: {product._id}</Typography>
            </Box>
          </Box>
          {!isEditMode ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditMode(true)}
              disabled={pageAccess === 'only view'}
              sx={{ 
                bgcolor: 'white', 
                color: '#2c3e50',
                fontWeight: 600,
                '&:hover': { bgcolor: '#f0f0f0' }
              }}
            >
              Edit Product
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />} 
                onClick={handleCancel} 
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                onClick={handleSave} 
                disabled={saving}
                sx={{ 
                  bgcolor: '#4caf50', 
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#45a049' }
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        {/* Images Section */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            🖼️ Product Images
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {product.img && (
              <Box>
                <Typography variant="caption" fontWeight={600} display="block" mb={1}>Main Image</Typography>
                <Image src={getImageUrl(product.img) || ''} alt="Main" width={200} height={200} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
              </Box>
            )}
            {product.image1 && (
              <Box>
                <Typography variant="caption" fontWeight={600} display="block" mb={1}>Image 1</Typography>
                <Image src={getImageUrl(product.image1) || ''} alt="Image 1" width={200} height={200} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
              </Box>
            )}
            {product.image2 && (
              <Box>
                <Typography variant="caption" fontWeight={600} display="block" mb={1}>Image 2</Typography>
                <Image src={getImageUrl(product.image2) || ''} alt="Image 2" width={200} height={200} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
              </Box>
            )}
            {product.video && (
              <Box>
                <Typography variant="caption" fontWeight={600} display="block" mb={1}>Video</Typography>
                <video src={getImageUrl(product.video) || ''} controls style={{ width: '100%', borderRadius: 8 }} />
              </Box>
            )}
          </Box>
        </Box>

        {/* Basic Information - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            📝 Basic Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            <Box sx={{ gridColumn: 'span 3' }}>
              {isEditMode ? (
                <TextField label="Product Name" value={editData.name || ''} onChange={(e) => setEditData({...editData, name: e.target.value})} fullWidth size="small" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>Product Name</Typography><Typography variant="body2">{currentData.name}</Typography></Box>
              )}
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              {isEditMode ? (
                <TextField label="Slug" value={editData.slug || ''} onChange={(e) => setEditData({...editData, slug: e.target.value})} fullWidth size="small" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>Slug</Typography><Typography variant="body2">{currentData.slug || '-'}</Typography></Box>
              )}
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {isEditMode ? (
                <TextField label="SKU" value={editData.sku || ''} onChange={(e) => setEditData({...editData, sku: e.target.value})} fullWidth size="small" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>SKU</Typography><Typography variant="body2">{currentData.sku || '-'}</Typography></Box>
              )}
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {isEditMode ? (
                <TextField label="Product ID" value={editData.productIdentifier || ''} onChange={(e) => setEditData({...editData, productIdentifier: e.target.value})} fullWidth size="small" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>Product ID</Typography><Typography variant="body2">{currentData.productIdentifier || '-'}</Typography></Box>
              )}
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {isEditMode ? (
                <TextField label="Vendor Fabric Code" value={editData.vendorFabricCode || ''} onChange={(e) => setEditData({...editData, vendorFabricCode: e.target.value})} fullWidth size="small" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>Vendor Fabric Code</Typography><Typography variant="body2">{currentData.vendorFabricCode || '-'}</Typography></Box>
              )}
            </Box>
            <Box sx={{ gridColumn: 'span 4' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>Lead Time (days)</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {Array.isArray(currentData.leadtime) && currentData.leadtime.length > 0 ? (
                  currentData.leadtime.map((time: string, i: number) => (
                    <Chip key={i} label={time} size="small" />
                  ))
                ) : (
                  <Typography variant="body2">-</Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              {isEditMode ? (
                <TextField label="Description" value={editData.productdescription || ''} onChange={(e) => setEditData({...editData, productdescription: e.target.value})} fullWidth multiline rows={2} size="small" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>Description</Typography><Typography variant="body2">{currentData.productdescription || '-'}</Typography></Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Categorization - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            🏷️ Categorization
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            {['category', 'substructure', 'content', 'design', 'subfinish', 'vendor', 'groupcode', 'motif'].map((field) => (
              <Box key={field}>
                {isEditMode ? (
                  <FormControl fullWidth size="small">
                    <InputLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</InputLabel>
                    <Select value={editData[field] || ''} onChange={(e) => setEditData({...editData, [field]: e.target.value})} label={field.charAt(0).toUpperCase() + field.slice(1)}>
                      {dropdowns[field]?.map((opt: any) => <MenuItem key={opt._id} value={opt._id}>{opt.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                ) : (
                  <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>{field.charAt(0).toUpperCase() + field.slice(1)}</Typography><Typography variant="body2">{(currentData[field] as any)?.name || currentData[field] || '-'}</Typography></Box>
                )}
              </Box>
            ))}
            <Box sx={{ gridColumn: 'span 3' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>Colors</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Array.isArray(currentData.color) ? currentData.color.map((c: any, i: number) => (
                  <Chip key={i} label={typeof c === 'string' ? c : c.name} size="small" />
                )) : <Chip label={typeof currentData.color === 'string' ? currentData.color : (currentData.color as any)?.name || '-'} size="small" />}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Suitable For - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            👔 Suitable For
          </Typography>
          {isEditMode ? (
            <Box>
              <TextField
                fullWidth
                size="small"
                label="Add Suitable For Item"
                placeholder="e.g., Male-Shirt-42 (press Enter to add)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    const value = input.value.trim();
                    if (value) {
                      const currentItems = Array.isArray(editData.subsuitable) ? editData.subsuitable : [];
                      // Check if it's a comma-separated string in array
                      const flatItems = currentItems.flatMap((item: string) => 
                        item.includes(',') ? item.split(',').map(s => s.trim()) : [item]
                      );
                      flatItems.push(value);
                      setEditData({...editData, subsuitable: [flatItems.join(',')]});
                      input.value = '';
                    }
                  }
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {Array.isArray(editData.subsuitable) && editData.subsuitable.length > 0 ? (
                  editData.subsuitable.flatMap((item: string) => 
                    item.includes(',') ? item.split(',').map(s => s.trim()) : [item]
                  ).map((item: string, i: number) => (
                    <Chip 
                      key={i} 
                      label={item} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      onDelete={() => {
                        const currentItems = editData.subsuitable.flatMap((it: string) => 
                          it.includes(',') ? it.split(',').map(s => s.trim()) : [it]
                        );
                        currentItems.splice(i, 1);
                        setEditData({...editData, subsuitable: currentItems.length > 0 ? [currentItems.join(',')] : []});
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No items added</Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Array.isArray(currentData.subsuitable) && currentData.subsuitable.length > 0 ? (
                currentData.subsuitable.flatMap((item: string) => 
                  item.includes(',') ? item.split(',').map(s => s.trim()) : [item]
                ).map((item: string, i: number) => (
                  <Chip key={i} label={item} size="small" color="primary" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No suitable for data</Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Lead Time - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            ⏱️ Lead Time
          </Typography>
          {isEditMode ? (
            <Box>
              <TextField
                fullWidth
                size="small"
                label="Add Lead Time (days)"
                placeholder="e.g., 7 (press Enter to add)"
                type="number"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    const value = input.value.trim();
                    if (value) {
                      const currentItems = Array.isArray(editData.leadtime) ? editData.leadtime : [];
                      setEditData({...editData, leadtime: [...currentItems, value]});
                      input.value = '';
                    }
                  }
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {Array.isArray(editData.leadtime) && editData.leadtime.length > 0 ? (
                  editData.leadtime.map((time: string, i: number) => (
                    <Chip 
                      key={i} 
                      label={`${time} days`} 
                      size="small"
                      onDelete={() => {
                        const newLeadtime = [...editData.leadtime];
                        newLeadtime.splice(i, 1);
                        setEditData({...editData, leadtime: newLeadtime});
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No lead time added</Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Array.isArray(currentData.leadtime) && currentData.leadtime.length > 0 ? (
                currentData.leadtime.map((time: string, i: number) => (
                  <Chip key={i} label={`${time} days`} size="small" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No lead time specified</Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Specifications - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            📏 Specifications
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            {[
              { field: 'um', label: 'Unit (UM)', editable: true },
              { field: 'currency', label: 'Currency', editable: true },
              { field: 'gsm', label: 'GSM', editable: true, type: 'number' },
              { field: 'oz', label: 'OZ', editable: false, type: 'number' },
              { field: 'cm', label: 'CM', editable: true, type: 'number' },
              { field: 'inch', label: 'INCH', editable: false, type: 'number' },
            ].map(({ field, label, editable, type }) => (
              <Box key={field}>
                {isEditMode && editable ? (
                  <TextField label={label} type={type || 'text'} value={editData[field] || ''} onChange={(e) => setEditData({...editData, [field]: e.target.value})} fullWidth size="small" />
                ) : (
                  <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography><Typography variant="body2">{currentData[field] || '-'}</Typography></Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Pricing & Inventory - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            💰 Pricing & Inventory
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            {[
              { field: 'purchasePrice', label: 'Purchase Price' },
              { field: 'salesPrice', label: 'Sales Price' },
              { field: 'quantity', label: 'MOQ' },
            ].map(({ field, label }) => (
              <Box key={field}>
                {isEditMode ? (
                  <TextField label={label} type="number" value={editData[field] || ''} onChange={(e) => setEditData({...editData, [field]: e.target.value})} fullWidth size="small" />
                ) : (
                  <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography><Typography variant="body2">{currentData[field] || '-'}</Typography></Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Flags & Ratings - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            ⭐ Flags & Ratings
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, alignItems: 'center' }}>
            {[
              { field: 'popularproduct', label: 'Popular Product' },
              { field: 'topratedproduct', label: 'Top Rated' },
              { field: 'landingPageProduct', label: 'Landing Page' },
              { field: 'shopyProduct', label: 'Shopy Product' },
            ].map(({ field, label }) => (
              <Box key={field}>
                {isEditMode ? (
                  <FormControlLabel control={<Checkbox checked={Boolean(editData[field])} onChange={(e) => setEditData({...editData, [field]: e.target.checked})} />} label={label} />
                ) : (
                  <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography><Typography variant="body2">{currentData[field] ? '✅ Yes' : '❌ No'}</Typography></Box>
                )}
              </Box>
            ))}
            {[
              { field: 'rating_value', label: 'Rating Value' },
              { field: 'rating_count', label: 'Rating Count' },
            ].map(({ field, label }) => (
              <Box key={field}>
                {isEditMode ? (
                  <TextField label={label} type="number" value={editData[field] || ''} onChange={(e) => setEditData({...editData, [field]: e.target.value})} fullWidth size="small" />
                ) : (
                  <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography><Typography variant="body2">{currentData[field] || '-'}</Typography></Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* SEO Settings - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            🔍 SEO Settings
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            <Box sx={{ gridColumn: 'span 2' }}>
              {isEditMode ? (
                <TextField label="OG Type" value={editData.ogType || ''} onChange={(e) => setEditData({...editData, ogType: e.target.value})} fullWidth size="small" placeholder="e.g., product" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>OG Type</Typography><Typography variant="body2">{currentData.ogType || '-'}</Typography></Box>
              )}
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {isEditMode ? (
                <TextField label="Twitter Card" value={editData.twitterCard || ''} onChange={(e) => setEditData({...editData, twitterCard: e.target.value})} fullWidth size="small" placeholder="e.g., summary_large_image" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>Twitter Card</Typography><Typography variant="body2">{currentData.twitterCard || '-'}</Typography></Box>
              )}
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              {isEditMode ? (
                <TextField label="OG/Twitter Image" value={editData.ogImage_twitterimage || ''} onChange={(e) => setEditData({...editData, ogImage_twitterimage: e.target.value})} fullWidth size="small" placeholder="https://..." />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>OG/Twitter Image</Typography><Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{currentData.ogImage_twitterimage || '-'}</Typography></Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Catalog Info - 6 columns */}
        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            📚 Catalog Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            <Box sx={{ gridColumn: 'span 3' }}>
              {isEditMode ? (
                <TextField label="Title" value={editData.productlocationtitle || ''} onChange={(e) => setEditData({...editData, productlocationtitle: e.target.value})} fullWidth size="small" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>Title</Typography><Typography variant="body2">{currentData.productlocationtitle || '-'}</Typography></Box>
              )}
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              {isEditMode ? (
                <TextField label="Tagline" value={editData.productlocationtagline || ''} onChange={(e) => setEditData({...editData, productlocationtagline: e.target.value})} fullWidth size="small" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>Tagline</Typography><Typography variant="body2">{currentData.productlocationtagline || '-'}</Typography></Box>
              )}
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              {isEditMode ? (
                <TextField label="Description 1" value={editData.productlocationdescription1 || ''} onChange={(e) => setEditData({...editData, productlocationdescription1: e.target.value})} fullWidth multiline rows={2} size="small" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>Description 1</Typography><Typography variant="body2">{currentData.productlocationdescription1 || '-'}</Typography></Box>
              )}
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              {isEditMode ? (
                <TextField label="Description 2" value={editData.productlocationdescription2 || ''} onChange={(e) => setEditData({...editData, productlocationdescription2: e.target.value})} fullWidth multiline rows={2} size="small" />
              ) : (
                <Box><Typography variant="caption" color="text.secondary" fontWeight={600}>Description 2</Typography><Typography variant="body2">{currentData.productlocationdescription2 || '-'}</Typography></Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

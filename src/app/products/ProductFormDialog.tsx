"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, AppBar, Toolbar, IconButton, Typography, Button, DialogContent,
  Box, TextField, Autocomplete, Chip, FormControl, InputLabel, Select, MenuItem,
  InputAdornment, Checkbox, FormControlLabel, CircularProgress
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';

interface EditableSubsuitableItem {
  gender: string;
  clothType: string;
  number: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  editId: string | null;
  submitting: boolean;
  products: any[];
  dropdowns: any;
  refreshDropdown: (key: string) => Promise<void>;
  handleProductSelect: any;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  image1Preview: string | null;
  setImage1Preview: React.Dispatch<React.SetStateAction<string | null>>;
  image2Preview: string | null;
  setImage2Preview: React.Dispatch<React.SetStateAction<string | null>>;
  videoPreview: string | null;
  setVideoPreview: React.Dispatch<React.SetStateAction<string | null>>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImage1Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImage2Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImage: (imageType: 'img' | 'image1' | 'image2') => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  image1InputRef: React.RefObject<HTMLInputElement | null>;
  image2InputRef: React.RefObject<HTMLInputElement | null>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  formImgDims: any;
  setFormImgDims: any;
  formVideoDims: any;
  setFormVideoDims: any;
  pageAccess: string;
  umOptions: string[];
  currencyOptions: string[];
  subsuitableInput: { gender: string; clothType: string; number: string };
  setSubsuitableInput: React.Dispatch<React.SetStateAction<{ gender: string; clothType: string; number: string }>>;
  editableSubsuitableItems: EditableSubsuitableItem[];
  handleAddSubsuitable: () => void;
  handleRemoveSubsuitable: (index: number) => void;
  handleUpdateSubsuitableItem: (index: number, field: 'gender' | 'clothType' | 'number', value: string) => void;
}

export default function ProductFormDialog({
  open, onClose, onSubmit, form, setForm, editId, submitting,
  products, dropdowns, refreshDropdown, handleProductSelect,
  imagePreview, setImagePreview, image1Preview, setImage1Preview,
  image2Preview, setImage2Preview, videoPreview, setVideoPreview,
  handleImageChange, handleImage1Change, handleImage2Change, handleDeleteImage,
  fileInputRef, image1InputRef, image2InputRef, videoInputRef,
  formImgDims, setFormImgDims, formVideoDims, setFormVideoDims,
  pageAccess, umOptions, currencyOptions,
  subsuitableInput, setSubsuitableInput, editableSubsuitableItems,
  handleAddSubsuitable, handleRemoveSubsuitable, handleUpdateSubsuitableItem
}: ProductFormDialogProps) {

  const dropdownFields = [
    { key: "category", label: "Category" },
    { key: "substructure", label: "Substructure" },
    { key: "content", label: "Content" },
    { key: "design", label: "Design" },
    { key: "subfinish", label: "Subfinish" },
    // subsuitable is now handled separately as a custom component
    { key: "vendor", label: "Vendor" },
    { key: "groupcode", label: "Groupcode" },
  ];

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar sx={{ position: 'relative', bgcolor: '#2c3e50' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <ClearIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flex: 1, fontWeight: 600, color: 'white' }}>
            {editId ? '✏️ Edit Product' : '➕ Add New Product'}
          </Typography>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={submitting || pageAccess === 'only view'}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ 
              bgcolor: 'white', 
              color: '#2c3e50',
              fontWeight: 600,
              '&:hover': { bgcolor: '#f0f0f0' },
              '&:disabled': { bgcolor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.5)' }
            }}
          >
            {submitting ? 'Saving...' : '💾 Save Product'}
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        {/* Quick Copy */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'white', borderRadius: 2 }}>
          <Autocomplete
            options={[...products].sort((a, b) => a.name.localeCompare(b.name)).map((p) => ({ label: p.name, value: p._id }))}
            getOptionLabel={option => typeof option === 'string' ? option : option.label}
            onChange={handleProductSelect}
            renderInput={(params) => (
              <TextField {...params} label="🔄 Copy From Existing Product" placeholder="Type to search..." />
            )}
            disabled={pageAccess === 'only view'}
          />
        </Box>

        {/* Images Section */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            🖼️ Product Images
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 3 }}>
            {/* Main Image */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Main Image *</Typography>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
              <Button
                fullWidth
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<ImageIcon />}
                disabled={pageAccess === 'only view'}
              >
                {imagePreview ? 'Change' : 'Upload'}
              </Button>
              {imagePreview && (
                <Box sx={{ position: 'relative', mt: 1 }}>
                  <Image src={imagePreview || ''} alt="Main" width={200} height={200} style={{ width: '100%', height: 'auto', borderRadius: 8 }} 
                    onLoad={e => setFormImgDims((dims: any) => ({ ...dims, img: [(e.target as HTMLImageElement).naturalWidth, (e.target as HTMLImageElement).naturalHeight] }))} />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteImage('img')}
                    sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {formImgDims?.img && <Typography variant="caption" display="block">{formImgDims.img[0]}×{formImgDims.img[1]}</Typography>}
                </Box>
              )}
            </Box>

            {/* Image 1 */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Image 1</Typography>
              <input type="file" ref={image1InputRef} onChange={handleImage1Change} accept="image/*" style={{ display: 'none' }} />
              <Button fullWidth variant="outlined" onClick={() => image1InputRef.current?.click()} startIcon={<ImageIcon />} disabled={pageAccess === 'only view'}>
                {image1Preview ? 'Change' : 'Upload'}
              </Button>
              {image1Preview && (
                <Box sx={{ position: 'relative', mt: 1 }}>
                  <Image src={image1Preview || ''} alt="Image 1" width={200} height={200} style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    onLoad={e => setFormImgDims((dims: any) => ({ ...dims, image1: [(e.target as HTMLImageElement).naturalWidth, (e.target as HTMLImageElement).naturalHeight] }))} />
                  <IconButton size="small" onClick={() => handleDeleteImage('image1')} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {formImgDims?.image1 && <Typography variant="caption" display="block">{formImgDims.image1[0]}×{formImgDims.image1[1]}</Typography>}
                </Box>
              )}
            </Box>

            {/* Image 2 */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Image 2</Typography>
              <input type="file" ref={image2InputRef} onChange={handleImage2Change} accept="image/*" style={{ display: 'none' }} />
              <Button fullWidth variant="outlined" onClick={() => image2InputRef.current?.click()} startIcon={<ImageIcon />} disabled={pageAccess === 'only view'}>
                {image2Preview ? 'Change' : 'Upload'}
              </Button>
              {image2Preview && (
                <Box sx={{ position: 'relative', mt: 1 }}>
                  <Image src={image2Preview || ''} alt="Image 2" width={200} height={200} style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                    onLoad={e => setFormImgDims((dims: any) => ({ ...dims, image2: [(e.target as HTMLImageElement).naturalWidth, (e.target as HTMLImageElement).naturalHeight] }))} />
                  <IconButton size="small" onClick={() => handleDeleteImage('image2')} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {formImgDims?.image2 && <Typography variant="caption" display="block">{formImgDims.image2[0]}×{formImgDims.image2[1]}</Typography>}
                </Box>
              )}
            </Box>

            {/* Video */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Video</Typography>
              <input type="file" ref={videoInputRef} accept="video/mp4" style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setForm((prev: any) => ({ ...prev, video: file }));
                    setVideoPreview(URL.createObjectURL(file));
                  }
                }} />
              <Button fullWidth variant="outlined" onClick={() => videoInputRef.current?.click()} startIcon={<ImageIcon />} disabled={pageAccess === 'only view'}>
                {videoPreview ? 'Change' : 'Upload'}
              </Button>
              {videoPreview && (
                <Box sx={{ mt: 1 }}>
                  <video src={videoPreview || ''} controls style={{ width: '100%', borderRadius: 8 }}
                    onLoadedMetadata={e => setFormVideoDims([(e.target as HTMLVideoElement).videoWidth, (e.target as HTMLVideoElement).videoHeight])} />
                  {formVideoDims && Array.isArray(formVideoDims) && <Typography variant="caption" display="block">{formVideoDims[0]}×{formVideoDims[1]}</Typography>}
                </Box>
              )}
            </Box>
          </Box>

          {/* Alt Text */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mt: 2 }}>
            <TextField label="Alt Text - Main" value={form.altimg1 || ''} onChange={(e) => setForm((prev: any) => ({ ...prev, altimg1: e.target.value }))} size="small" disabled={pageAccess === 'only view'} />
            <TextField label="Alt Text - Image 1" value={form.altimg2 || ''} onChange={(e) => setForm((prev: any) => ({ ...prev, altimg2: e.target.value }))} size="small" disabled={pageAccess === 'only view'} />
            <TextField label="Alt Text - Image 2" value={form.altimg3 || ''} onChange={(e) => setForm((prev: any) => ({ ...prev, altimg3: e.target.value }))} size="small" disabled={pageAccess === 'only view'} />
            <TextField label="Alt Text - Video" value={form.altvideo || ''} onChange={(e) => setForm((prev: any) => ({ ...prev, altvideo: e.target.value }))} size="small" disabled={pageAccess === 'only view'} />
          </Box>
        </Box>

        {/* Basic Info - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            📝 Basic Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            <Box sx={{ gridColumn: 'span 3' }}>
              <TextField label="Product Name *" value={form.name} onChange={(e) => setForm((prev: any) => ({ ...prev, name: e.target.value }))} fullWidth required disabled={pageAccess === 'only view'} />
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <TextField label="Slug" value={form.slug || ''} onChange={(e) => setForm((prev: any) => ({ ...prev, slug: e.target.value }))} fullWidth helperText="Auto-generated if empty" disabled={pageAccess === 'only view'} />
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              <TextField label="Description" value={form.productdescription || ''} onChange={(e) => setForm((prev: any) => ({ ...prev, productdescription: e.target.value }))} fullWidth multiline rows={3} disabled={pageAccess === 'only view'} />
            </Box>
          </Box>
        </Box>

        {/* Categorization - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            🏷️ Categorization
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            {dropdownFields.map((field) => (
              <FormControl key={field.key} fullWidth>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={form[field.key] || ""}
                  onChange={(e) => setForm((prev: any) => ({ ...prev, [field.key]: e.target.value }))}
                  label={field.label}
                  onOpen={() => refreshDropdown(field.key)}
                  disabled={pageAccess === 'only view'}
                  endAdornment={
                    form[field.key] && (
                      <InputAdornment position="end" sx={{ mr: 1 }}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setForm((prev: any) => ({ ...prev, [field.key]: '' })); }}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                >
                  {dropdowns[field.key]?.map((option: any) => (
                    <MenuItem key={option._id} value={option._id}>{option.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}

            <FormControl fullWidth>
              <InputLabel>Motif</InputLabel>
              <Select value={form.motif || ""} onChange={(e) => setForm((prev: any) => ({ ...prev, motif: e.target.value }))} label="Motif" onOpen={() => refreshDropdown('motif')} disabled={pageAccess === 'only view'}>
                {dropdowns.motif?.map((option: any) => (
                  <MenuItem key={option._id} value={option._id}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ gridColumn: 'span 3' }}>
              <Autocomplete
                multiple
                options={dropdowns.color || []}
                getOptionLabel={(option: any) => option.name || option._id || ''}
                value={form.colors.map((colorId: string) => dropdowns.color?.find((c: any) => c._id === colorId)).filter(Boolean)}
                onChange={(_, newValue) => setForm((prev: any) => ({ ...prev, colors: newValue.map((item: any) => item._id) }))}
                renderInput={(params) => <TextField {...params} label="Colors" />}
                renderTags={(value, getTagProps) =>
                  value.map((option: any, index) => (
                    <Chip {...getTagProps({ index })} key={option._id} label={option.name} size="small" />
                  ))
                }
                disabled={pageAccess === 'only view'}
              />
            </Box>
          </Box>
        </Box>

        {/* Subsuitable Builder - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            👔 Suitable For (Gender-ClothType-Number)
          </Typography>
          
          {/* Input fields for adding new subsuitable item */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, mb: 2 }}>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                fullWidth
                label="Gender"
                value={subsuitableInput.gender}
                onChange={(e) => setSubsuitableInput(prev => ({ ...prev, gender: e.target.value }))}
                placeholder="e.g., Men, Women, Kids"
                disabled={pageAccess === 'only view'}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField
                fullWidth
                label="Type of Cloth"
                value={subsuitableInput.clothType}
                onChange={(e) => setSubsuitableInput(prev => ({ ...prev, clothType: e.target.value }))}
                placeholder="e.g., Shirt, Dress, Pants"
                disabled={pageAccess === 'only view'}
              />
            </Box>
            <TextField
              fullWidth
              label="Number"
              value={subsuitableInput.number}
              onChange={(e) => setSubsuitableInput(prev => ({ ...prev, number: e.target.value }))}
              placeholder="e.g., 42, 38"
              disabled={pageAccess === 'only view'}
            />
            <Button
              variant="contained"
              onClick={handleAddSubsuitable}
              disabled={pageAccess === 'only view'}
              sx={{ height: '56px' }}
            >
              Add
            </Button>
          </Box>

          {/* Display added subsuitable items */}
          {editableSubsuitableItems.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Added Items:</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {editableSubsuitableItems.map((item, index) => (
                  <Box key={index} sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Box sx={{ gridColumn: 'span 2' }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={item.gender}
                        onChange={(e) => handleUpdateSubsuitableItem(index, 'gender', e.target.value)}
                        disabled={pageAccess === 'only view'}
                      />
                    </Box>
                    <Box sx={{ gridColumn: 'span 2' }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={item.clothType}
                        onChange={(e) => handleUpdateSubsuitableItem(index, 'clothType', e.target.value)}
                        disabled={pageAccess === 'only view'}
                      />
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      value={item.number}
                      onChange={(e) => handleUpdateSubsuitableItem(index, 'number', e.target.value)}
                      disabled={pageAccess === 'only view'}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveSubsuitable(index)}
                      disabled={pageAccess === 'only view'}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Lead Time - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            ⏱️ Lead Time
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={form.leadtime || []}
            onChange={(_, newValue) => setForm((prev: any) => ({ ...prev, leadtime: newValue }))}
            renderInput={(params) => <TextField {...params} label="Lead Time (days)" placeholder="Type and press Enter" />}
            renderTags={(value, getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip {...getTagProps({ index })} key={index} label={option} size="small" />
              ))
            }
            disabled={pageAccess === 'only view'}
          />
        </Box>

        {/* Specifications - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            📏 Specifications
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select value={form.um || ""} onChange={e => setForm((prev: any) => ({ ...prev, um: e.target.value }))} label="Unit" disabled={pageAccess === 'only view'}>
                {umOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
            <Autocomplete
              freeSolo
              options={currencyOptions}
              value={form.currency || ""}
              onInputChange={(_, value) => setForm((prev: any) => ({ ...prev, currency: value }))}
              renderInput={(params) => <TextField {...params} label="Currency" />}
              disabled={pageAccess === 'only view'}
            />
            <TextField label="GSM" type="number" value={form.gsm || ""} onChange={e => setForm((prev: any) => ({ ...prev, gsm: e.target.value }))} disabled={pageAccess === 'only view'} />
            <TextField label="OZ (Auto)" type="number" value={form.oz || ""} disabled />
            <TextField label="CM" type="number" value={form.cm || ""} onChange={e => setForm((prev: any) => ({ ...prev, cm: e.target.value }))} disabled={pageAccess === 'only view'} />
            <TextField label="INCH (Auto)" type="number" value={form.inch || ""} disabled />
          </Box>
        </Box>

        {/* Pricing & Inventory - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            💰 Pricing & Inventory
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            <TextField label="Purchase Price" type="number" value={form.purchasePrice || ""} onChange={e => setForm((prev: any) => ({ ...prev, purchasePrice: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start">{form.currency || '₹'}</InputAdornment> }} disabled={pageAccess === 'only view'} />
            <TextField label="Sales Price" type="number" value={form.salesPrice || ""} onChange={e => setForm((prev: any) => ({ ...prev, salesPrice: e.target.value }))} InputProps={{ startAdornment: <InputAdornment position="start">{form.currency || '₹'}</InputAdornment> }} disabled={pageAccess === 'only view'} />
            <TextField label="Vendor Fabric Code" value={form.vendorFabricCode || ""} onChange={e => setForm((prev: any) => ({ ...prev, vendorFabricCode: e.target.value }))} disabled={pageAccess === 'only view'} />
            <TextField label="SKU" value={form.sku || ""} onChange={e => setForm((prev: any) => ({ ...prev, sku: e.target.value }))} disabled={pageAccess === 'only view'} />
            <TextField label="Product ID" value={form.productIdentifier || ""} onChange={e => setForm((prev: any) => ({ ...prev, productIdentifier: e.target.value }))} disabled={pageAccess === 'only view'} />
          </Box>
        </Box>

        {/* Flags & Ratings - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            ⭐ Flags & Ratings
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2, alignItems: 'center' }}>
            <FormControlLabel control={<Checkbox checked={Boolean(form.popularproduct)} onChange={e => setForm((prev: any) => ({ ...prev, popularproduct: e.target.checked }))} disabled={pageAccess === 'only view'} />} label="Popular" />
            <FormControlLabel control={<Checkbox checked={Boolean(form.topratedproduct)} onChange={e => setForm((prev: any) => ({ ...prev, topratedproduct: e.target.checked }))} disabled={pageAccess === 'only view'} />} label="Top Rated" />
            <FormControlLabel control={<Checkbox checked={Boolean(form.landingPageProduct)} onChange={e => setForm((prev: any) => ({ ...prev, landingPageProduct: e.target.checked }))} disabled={pageAccess === 'only view'} />} label="Landing Page" />
            <FormControlLabel control={<Checkbox checked={Boolean(form.shopyProduct)} onChange={e => setForm((prev: any) => ({ ...prev, shopyProduct: e.target.checked }))} disabled={pageAccess === 'only view'} />} label="Shopy" />
            <TextField label="Rating (0-5)" type="number" value={form.rating_value || ""} onChange={e => setForm((prev: any) => ({ ...prev, rating_value: e.target.value }))} inputProps={{ min: 0, max: 5, step: 0.1 }} disabled={pageAccess === 'only view'} />
            <TextField label="Rating Count" type="number" value={form.rating_count || ""} onChange={e => setForm((prev: any) => ({ ...prev, rating_count: e.target.value }))} inputProps={{ min: 0 }} disabled={pageAccess === 'only view'} />
          </Box>
        </Box>

        {/* SEO Fields - 6 columns */}
        <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
            🔍 SEO Settings
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 2 }}>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField 
                label="OG Type" 
                value={form.ogType || ""} 
                onChange={e => setForm((prev: any) => ({ ...prev, ogType: e.target.value }))} 
                fullWidth 
                placeholder="e.g., product, website"
                disabled={pageAccess === 'only view'} 
              />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField 
                label="Twitter Card" 
                value={form.twitterCard || "summary_large_image"} 
                onChange={e => setForm((prev: any) => ({ ...prev, twitterCard: e.target.value }))} 
                fullWidth 
                placeholder="e.g., summary_large_image"
                disabled={pageAccess === 'only view'} 
              />
            </Box>
            <Box sx={{ gridColumn: 'span 2' }}>
              <TextField 
                label="OG/Twitter Image URL" 
                value={form.ogImage_twitterimage || ""} 
                onChange={e => setForm((prev: any) => ({ ...prev, ogImage_twitterimage: e.target.value }))} 
                fullWidth 
                placeholder="https://..."
                disabled={pageAccess === 'only view'} 
              />
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
              <TextField label="Title" value={form.productlocationtitle || ""} onChange={e => setForm((prev: any) => ({ ...prev, productlocationtitle: e.target.value }))} fullWidth disabled={pageAccess === 'only view'} />
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <TextField label="Tagline" value={form.productlocationtagline || ""} onChange={e => setForm((prev: any) => ({ ...prev, productlocationtagline: e.target.value }))} fullWidth disabled={pageAccess === 'only view'} />
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              <TextField label="Description 1" value={form.productlocationdescription1 || ""} onChange={e => setForm((prev: any) => ({ ...prev, productlocationdescription1: e.target.value }))} fullWidth multiline rows={2} disabled={pageAccess === 'only view'} />
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              <TextField label="Description 2" value={form.productlocationdescription2 || ""} onChange={e => setForm((prev: any) => ({ ...prev, productlocationdescription2: e.target.value }))} fullWidth multiline rows={2} disabled={pageAccess === 'only view'} />
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

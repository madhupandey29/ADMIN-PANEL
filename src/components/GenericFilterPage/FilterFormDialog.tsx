"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Typography,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import { FilterConfig } from './types';

interface FilterFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  config: FilterConfig;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  editId: string | null;
  submitting: boolean;
  viewOnly: boolean;
}

export default function FilterFormDialog({
  open,
  onClose,
  onSubmit,
  config,
  form,
  setForm,
  editId,
  submitting,
  viewOnly,
}: FilterFormDialogProps) {
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});

  const handleChange = useCallback((fieldName: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [fieldName]: value }));
  }, [setForm]);

  const handleImageChange = useCallback((fieldName: string, file: File | null) => {
    if (file) {
      setForm((prev: any) => ({ ...prev, [fieldName]: file }));
      setImagePreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  }, [setForm]);

  const handleDeleteImage = useCallback((fieldName: string) => {
    setForm((prev: any) => ({ ...prev, [fieldName]: undefined }));
    setImagePreviews(prev => ({ ...prev, [fieldName]: null }));
  }, [setForm]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  }, [form, onSubmit]);

  const renderField = (field: any) => {
    const value = form[field.name] || '';

    switch (field.type) {
      case 'image':
        const preview = imagePreviews[field.name] || (typeof value === 'string' ? value : null);
        return (
          <Box key={field.name} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 200,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: viewOnly ? 'default' : 'pointer',
                '&:hover': {
                  borderColor: viewOnly ? 'divider' : 'primary.main',
                },
                position: 'relative',
                overflow: 'hidden',
              }}
              onClick={() => !viewOnly && document.getElementById(`${field.name}-upload`)?.click()}
            >
              {preview ? (
                <Image
                  src={preview}
                  alt={field.label}
                  width={200}
                  height={200}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <>
                  <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {viewOnly ? 'No image' : 'Click to upload'}
                  </Typography>
                </>
              )}
              <input
                type="file"
                id={`${field.name}-upload`}
                accept={field.accept || "image/*"}
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(field.name, e.target.files?.[0] || null)}
                disabled={viewOnly}
              />
            </Box>
            {preview && !viewOnly && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteImage(field.name)}
                sx={{ mt: 1 }}
                fullWidth
              >
                Remove Image
              </Button>
            )}
            {field.helperText && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {field.helperText}
              </Typography>
            )}
          </Box>
        );

      case 'select':
        return (
          <FormControl key={field.name} fullWidth sx={{ mb: 3 }}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              disabled={submitting || viewOnly}
            >
              {field.options?.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'textarea':
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            disabled={submitting || viewOnly}
            multiline
            rows={field.rows || 4}
            helperText={field.helperText}
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'number':
        return (
          <TextField
            key={field.name}
            fullWidth
            type="number"
            label={field.label}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            disabled={submitting || viewOnly}
            helperText={field.helperText}
            placeholder={field.placeholder}
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return (
          <TextField
            key={field.name}
            fullWidth
            type={field.type}
            label={field.label}
            name={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            disabled={submitting || viewOnly}
            helperText={field.helperText}
            placeholder={field.placeholder}
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{
        fontWeight: 600,
        fontSize: 20,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {editId ? `Edit ${config.name}` : `Add New ${config.name}`}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {config.fields.map(field => renderField(field))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            onClick={onClose}
            disabled={submitting}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          {!viewOnly && (
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ textTransform: 'none', minWidth: 100 }}
            >
              {submitting ? <CircularProgress size={24} /> : (editId ? 'Update' : 'Create')}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}

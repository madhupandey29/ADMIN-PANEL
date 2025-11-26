"use client";
import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Typography,
  Autocomplete,
  Chip,
  FormControlLabel,
  Checkbox,
  Switch,
  CircularProgress,
  Grid,
  InputAdornment,
  FormHelperText,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';

export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'autocomplete'
  | 'checkbox'
  | 'switch'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'file'
  | 'image'
  | 'color'
  | 'url'
  | 'tel'
  | 'custom';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  multiple?: boolean;
  multiline?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  pattern?: string;
  validation?: (value: any) => string | null;
  onChange?: (value: any, formData: Record<string, any>) => void;
  render?: (value: any, onChange: (value: any) => void, formData: Record<string, any>) => React.ReactNode;
  gridSize?: { xs?: number; sm?: number; md?: number; lg?: number };
  dependsOn?: string;
  showIf?: (formData: Record<string, any>) => boolean;
}

export interface FormSection {
  title?: string;
  description?: string;
  fields: FormField[];
}

interface EnhancedFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  title: string;
  fields?: FormField[];
  sections?: FormSection[];
  initialData?: Record<string, any>;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  showCloseButton?: boolean;
  validateOnChange?: boolean;
}

const EnhancedFormDialog: React.FC<EnhancedFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  fields = [],
  sections = [],
  initialData = {},
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  maxWidth = 'md',
  fullWidth = true,
  loading = false,
  showCloseButton = true,
  validateOnChange = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});

  // Initialize form data
  useEffect(() => {
    if (open) {
      const allFields = sections.length > 0 
        ? sections.flatMap(s => s.fields)
        : fields;
      
      const initialFormData: Record<string, any> = {};
      allFields.forEach(field => {
        if (initialData[field.name] !== undefined) {
          initialFormData[field.name] = initialData[field.name];
        } else if (field.defaultValue !== undefined) {
          initialFormData[field.name] = field.defaultValue;
        } else {
          // Set default values based on field type
          switch (field.type) {
            case 'checkbox':
            case 'switch':
              initialFormData[field.name] = false;
              break;
            case 'multiselect':
              initialFormData[field.name] = [];
              break;
            case 'number':
              initialFormData[field.name] = '';
              break;
            default:
              initialFormData[field.name] = '';
          }
        }
      });
      
      setFormData(initialFormData);
      setErrors({});
      
      // Set image previews for existing images
      const previews: Record<string, string> = {};
      allFields.forEach(field => {
        if ((field.type === 'image' || field.type === 'file') && initialData[field.name]) {
          if (typeof initialData[field.name] === 'string') {
            previews[field.name] = initialData[field.name];
          }
        }
      });
      setImagePreviews(previews);
    }
  }, [open, initialData, fields, sections]);

  const validateField = useCallback((field: FormField, value: any): string | null => {
    if (field.required && !value && value !== 0 && value !== false) {
      return `${field.label} is required`;
    }
    
    if (field.validation) {
      return field.validation(value);
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email address';
      }
    }
    
    if (field.type === 'url' && value) {
      try {
        new URL(value);
      } catch {
        return 'Invalid URL';
      }
    }
    
    if (field.type === 'number' && value !== '') {
      if (field.min !== undefined && Number(value) < field.min) {
        return `Minimum value is ${field.min}`;
      }
      if (field.max !== undefined && Number(value) > field.max) {
        return `Maximum value is ${field.max}`;
      }
    }
    
    return null;
  }, []);

  const handleChange = useCallback((field: FormField, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field.name]: value };
      
      // Call field's onChange if provided
      if (field.onChange) {
        field.onChange(value, newData);
      }
      
      return newData;
    });
    
    // Validate on change if enabled
    if (validateOnChange) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field.name]: error || '',
      }));
    }
  }, [validateField, validateOnChange]);

  const handleFileChange = useCallback((field: FormField, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleChange(field, file);
      
      // Create preview for images
      if (field.type === 'image' || file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => ({
            ...prev,
            [field.name]: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  }, [handleChange]);

  const handleRemoveImage = useCallback((fieldName: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const allFields = sections.length > 0 
      ? sections.flatMap(s => s.fields)
      : fields;
    
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    allFields.forEach(field => {
      // Skip validation if field is hidden
      if (field.showIf && !field.showIf(formData)) {
        return;
      }
      
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [fields, sections, formData, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  }, [formData, validateForm, onSubmit, onClose]);

  const renderField = useCallback((field: FormField) => {
    // Check if field should be shown
    if (field.showIf && !field.showIf(formData)) {
      return null;
    }
    
    const value = formData[field.name];
    const error = errors[field.name];
    const commonProps = {
      fullWidth: true,
      disabled: field.disabled || loading,
      error: Boolean(error),
      helperText: error || field.helperText,
    };
    
    // Custom render function
    if (field.render) {
      return (
        <Box key={field.name}>
          {field.render(value, (newValue) => handleChange(field, newValue), formData)}
        </Box>
      );
    }
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'url':
      case 'tel':
        return (
          <TextField
            key={field.name}
            label={field.label}
            type={field.type}
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            {...commonProps}
          />
        );
      
      case 'number':
        return (
          <TextField
            key={field.name}
            label={field.label}
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            inputProps={{
              min: field.min,
              max: field.max,
              step: field.step,
            }}
            {...commonProps}
          />
        );
      
      case 'textarea':
        return (
          <TextField
            key={field.name}
            label={field.label}
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            multiline
            rows={field.rows || 4}
            {...commonProps}
          />
        );
      
      case 'select':
        return (
          <FormControl key={field.name} {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              label={field.label}
              required={field.required}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error || field.helperText) && (
              <FormHelperText error={Boolean(error)}>
                {error || field.helperText}
              </FormHelperText>
            )}
          </FormControl>
        );
      
      case 'multiselect':
        return (
          <FormControl key={field.name} {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              value={value || []}
              onChange={(e) => handleChange(field, e.target.value)}
              label={field.label}
              required={field.required}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as any[]).map((val) => {
                    const option = field.options?.find(o => o.value === val);
                    return (
                      <Chip key={val} label={option?.label || val} size="small" />
                    );
                  })}
                </Box>
              )}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error || field.helperText) && (
              <FormHelperText error={Boolean(error)}>
                {error || field.helperText}
              </FormHelperText>
            )}
          </FormControl>
        );
      
      case 'autocomplete':
        return (
          <Autocomplete
            key={field.name}
            options={field.options || []}
            value={field.options?.find(o => o.value === value) || null}
            onChange={(_, newValue) => handleChange(field, newValue?.value || '')}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                {...commonProps}
              />
            )}
            disabled={field.disabled || loading}
          />
        );
      
      case 'checkbox':
        return (
          <FormControlLabel
            key={field.name}
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(e) => handleChange(field, e.target.checked)}
                disabled={field.disabled || loading}
              />
            }
            label={field.label}
          />
        );
      
      case 'switch':
        return (
          <FormControlLabel
            key={field.name}
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(e) => handleChange(field, e.target.checked)}
                disabled={field.disabled || loading}
              />
            }
            label={field.label}
          />
        );
      
      case 'date':
      case 'datetime-local':
      case 'time':
        return (
          <TextField
            key={field.name}
            label={field.label}
            type={field.type}
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            required={field.required}
            InputLabelProps={{ shrink: true }}
            {...commonProps}
          />
        );
      
      case 'image':
      case 'file':
        return (
          <Box key={field.name}>
            <input
              accept={field.accept || (field.type === 'image' ? 'image/*' : undefined)}
              style={{ display: 'none' }}
              id={`file-input-${field.name}`}
              type="file"
              onChange={(e) => handleFileChange(field, e)}
              disabled={field.disabled || loading}
            />
            <label htmlFor={`file-input-${field.name}`}>
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
                disabled={field.disabled || loading}
              >
                {field.label}
              </Button>
            </label>
            {imagePreviews[field.name] && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    position: 'relative',
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Image
                    src={imagePreviews[field.name]}
                    alt="Preview"
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(field.name)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'error.light' },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            {error && (
              <FormHelperText error>{error}</FormHelperText>
            )}
          </Box>
        );
      
      case 'color':
        return (
          <TextField
            key={field.name}
            label={field.label}
            type="color"
            value={value || '#000000'}
            onChange={(e) => handleChange(field, e.target.value)}
            required={field.required}
            {...commonProps}
          />
        );
      
      default:
        return null;
    }
  }, [formData, errors, loading, handleChange, handleFileChange, handleRemoveImage, imagePreviews]);

  const allFields = sections.length > 0 ? sections.flatMap(s => s.fields) : fields;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            size="small"
            disabled={submitting}
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'error.main' },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {sections.length > 0 ? (
            // Render sections
            sections.map((section, sectionIndex) => (
              <Box key={sectionIndex} sx={{ mb: sectionIndex < sections.length - 1 ? 4 : 0 }}>
                {section.title && (
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {section.title}
                  </Typography>
                )}
                {section.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {section.description}
                  </Typography>
                )}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                  {section.fields.map((field) => {
                    const xs = field.gridSize?.xs || 12;
                    const sm = field.gridSize?.sm || 12;
                    const md = field.gridSize?.md || 12;
                    const lg = field.gridSize?.lg || 12;
                    
                    return (
                      <Box
                        key={field.name}
                        sx={{
                          gridColumn: {
                            xs: `span ${xs}`,
                            sm: `span ${sm}`,
                            md: `span ${md}`,
                            lg: `span ${lg}`,
                          },
                        }}
                      >
                        {renderField(field)}
                      </Box>
                    );
                  })}
                </Box>
                {sectionIndex < sections.length - 1 && (
                  <Divider sx={{ mt: 3 }} />
                )}
              </Box>
            ))
          ) : (
            // Render fields without sections
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
              {allFields.map((field) => {
                const xs = field.gridSize?.xs || 12;
                const sm = field.gridSize?.sm || 12;
                const md = field.gridSize?.md || 12;
                const lg = field.gridSize?.lg || 12;
                
                return (
                  <Box
                    key={field.name}
                    sx={{
                      gridColumn: {
                        xs: `span ${xs}`,
                        sm: `span ${sm}`,
                        md: `span ${md}`,
                        lg: `span ${lg}`,
                      },
                    }}
                  >
                    {renderField(field)}
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button
            onClick={onClose}
            disabled={submitting}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || loading}
            startIcon={submitting && <CircularProgress size={16} />}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            {submitting ? 'Submitting...' : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EnhancedFormDialog;

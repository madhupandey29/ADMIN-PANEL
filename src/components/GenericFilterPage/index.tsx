"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { apiFetch } from '../../utils/apiFetch';
import { EnhancedDataTable } from '@/components';
import type { Column } from '@/components';
import { FilterConfig } from './types';
import FilterFormDialog from './FilterFormDialog';

interface GenericFilterPageProps {
  config: FilterConfig;
}

function getFilterPagePermission() {
  if (typeof window === 'undefined') return 'no access';
  const email = localStorage.getItem('admin-email');
  const superAdmin = process.env.NEXT_PUBLIC_SUPER_ADMIN;
  if (email && superAdmin && email === superAdmin) return 'all access';
  const perms = JSON.parse(localStorage.getItem('admin-permissions') || '{}');
  if (perms && perms.filter) {
    return perms.filter;
  }
  return 'no access';
}

export default function GenericFilterPage({ config }: GenericFilterPageProps) {
  const [pageAccess, setPageAccess] = useState<'all access' | 'only view' | 'no access'>('no access');
  const [data, setData] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const features = useMemo(() => ({
    hasImage: config.features?.hasImage ?? false,
    hasAdd: config.features?.hasAdd ?? true,
    hasEdit: config.features?.hasEdit ?? true,
    hasDelete: config.features?.hasDelete ?? true,
    hasView: config.features?.hasView ?? false,
    hasExport: config.features?.hasExport ?? true,
    hasSearch: config.features?.hasSearch ?? true,
  }), [config.features]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log(`[GenericFilterPage] Fetching from: ${config.apiEndpoint}`);
      const res = await apiFetch(config.apiEndpoint);
      const result = await res.json();
      console.log(`[GenericFilterPage] API Response for ${config.namePlural}:`, result);
      
      // Handle different response structures
      let items;
      if (Array.isArray(result.data)) {
        items = result.data;
      } else if (result.data && typeof result.data === 'object') {
        // For nested structures like { data: { countries: [...] } }
        items = result.data;
      } else if (Array.isArray(result)) {
        items = result;
      } else {
        items = [];
      }
      
      console.log(`[GenericFilterPage] Items before transform:`, items);
      const finalData = config.transformData ? config.transformData(items) : items;
      console.log(`[GenericFilterPage] Final data for ${config.namePlural}:`, finalData);
      setData(finalData);
    } catch (error) {
      console.error(`Error fetching ${config.namePlural}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    setPageAccess(getFilterPagePermission());
  }, []);

  useEffect(() => {
    if (pageAccess !== 'no access') {
      fetchData();
    }
  }, [pageAccess, fetchData]);

  const handleAdd = useCallback(() => {
    setEditId(null);
    const initialForm: any = {};
    config.fields.forEach(field => {
      initialForm[field.name] = field.type === 'image' ? undefined : '';
    });
    setForm(initialForm);
    setOpen(true);
  }, [config.fields]);

  const handleEdit = useCallback((item: any) => {
    setEditId(item._id);
    const editForm: any = {};
    config.fields.forEach(field => {
      editForm[field.name] = item[field.name] || (field.type === 'image' ? undefined : '');
    });
    setForm(editForm);
    setOpen(true);
  }, [config.fields]);

  const handleDelete = useCallback(async (item: any) => {
    if (!item._id) return;
    
    if (confirm(`Are you sure you want to delete "${item.name || item[config.fields[0].name]}"?`)) {
      try {
        const res = await apiFetch(`${config.apiEndpoint}/${item._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchData();
          alert(`${config.name} deleted successfully!`);
        } else {
          const error = await res.json();
          alert(error.message || "An error occurred");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while deleting");
      }
    }
  }, [config, fetchData]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditId(null);
    setForm({});
  }, []);

  const handleSubmit = useCallback(async (formData: any) => {
    setSubmitting(true);
    try {
      // Validate if custom validation exists
      if (config.validate) {
        const error = config.validate(formData);
        if (error) {
          alert(error);
          return;
        }
      }

      // Format data before submit
      let submitData: any;
      if (config.formatBeforeSubmit) {
        submitData = config.formatBeforeSubmit(formData);
      } else {
        // Default: create FormData for image uploads
        if (features.hasImage) {
          const fd = new FormData();
          Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              if (value instanceof File) {
                fd.append(key, value);
              } else {
                fd.append(key, String(value));
              }
            }
          });
          submitData = fd;
        } else {
          submitData = JSON.stringify(formData);
        }
      }

      const method = editId ? "PUT" : "POST";
      const url = `${config.apiEndpoint}${editId ? "/" + editId : ""}`;
      
      const options: RequestInit = {
        method,
        body: submitData,
      };

      // Add content-type header only for JSON
      if (!(submitData instanceof FormData)) {
        options.headers = { 'Content-Type': 'application/json' };
      }

      const res = await apiFetch(url, options);
      
      if (res.ok) {
        fetchData();
        handleClose();
        alert(`${config.name} ${editId ? 'updated' : 'created'} successfully!`);
      } else {
        const error = await res.json();
        alert(error.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  }, [config, editId, features.hasImage, fetchData, handleClose]);

  const handleExportSelected = useCallback(() => {
    if (selectedItems.length === 0) return;

    const dataStr = JSON.stringify(selectedItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.namePlural.toLowerCase()}-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert(`Exported ${selectedItems.length} ${config.namePlural.toLowerCase()} successfully!`);
  }, [selectedItems, config.namePlural]);

  // Convert config columns to EnhancedDataTable columns
  const columns: Column<any>[] = useMemo(() => {
    return config.columns.map(col => ({
      id: col.id,
      label: col.label,
      sortable: col.sortable ?? true,
      filterable: col.filterable ?? true,
      type: col.type,
      format: col.format,
      minWidth: col.minWidth,
    }));
  }, [config.columns]);

  if (pageAccess === 'no access') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ color: 'error.main', mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {pageAccess === 'only view' && (
        <Box sx={{ mb: 2 }}>
          <Paper elevation={2} sx={{ p: 2, bgcolor: '#fffbe6', border: '1px solid #ffe58f' }}>
            <Typography color="#ad6800" fontWeight={600}>
              You have view-only access. To make changes, contact your admin.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Ultra Compact Header - Icon, Title, Add, Export ALL in ONE row - LEFT ALIGNED */}
      <Box sx={{ 
        mb: 0.5, 
        mt: 0,
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        flexWrap: 'nowrap',
        minHeight: 40
      }}>
        {/* Left: Icon + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: '0 0 auto' }}>
          <Box sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
            {config.icon}
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, whiteSpace: 'nowrap', fontSize: '15px' }}>
            {config.namePlural} Management
          </Typography>
        </Box>

        {/* Left: Add and Export buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: '0 0 auto' }}>
          {features.hasAdd && (
            <Button
              variant="contained"
              size="small"
              color="success"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={handleAdd}
              disabled={pageAccess === 'only view'}
              sx={{ 
                whiteSpace: 'nowrap',
                py: 0.5,
                px: 1.5,
                fontSize: '13px',
                minHeight: 32
              }}
            >
              Add {config.name}
            </Button>
          )}
          {features.hasExport && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
              onClick={handleExportSelected}
              disabled={selectedItems.length === 0 || pageAccess === 'only view'}
              sx={{ 
                whiteSpace: 'nowrap',
                py: 0.5,
                px: 1.5,
                fontSize: '13px',
                minHeight: 32,
                borderWidth: '1.5px',
                '&:hover': {
                  borderWidth: '1.5px'
                }
              }}
            >
              Export ({selectedItems.length})
            </Button>
          )}
        </Box>
      </Box>

      {/* Data Table - No search bar, it's in the header now */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <EnhancedDataTable
          columns={columns}
          data={data}
          selectable={features.hasExport}
          onSelectionChange={setSelectedItems}
          onEdit={features.hasEdit && pageAccess !== 'only view' ? handleEdit : undefined}
          onDelete={features.hasDelete && pageAccess !== 'only view' ? handleDelete : undefined}
          enableColumnFilters={features.hasSearch}
          enableColumnManagement
          searchable
          rowsPerPage={15}
          searchPlaceholder={`Search ${config.namePlural.toLowerCase()}...`}
          storageKey={`${config.namePlural.toLowerCase()}-table`}
        />
      )}

      {/* Form Dialog */}
      {open && (
        <FilterFormDialog
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit}
          config={config}
          form={form}
          setForm={setForm}
          editId={editId}
          submitting={submitting}
          viewOnly={pageAccess === 'only view'}
        />
      )}
    </Box>
  );
}

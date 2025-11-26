"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Typography, Button, Box, Chip, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { apiFetch } from '../../utils/apiFetch';
import { EnhancedDataTable } from '@/components';
import type { Column } from '@/components';
import SeoFormDialog from './SeoFormDialog';
import SeoViewDialog from './SeoViewDialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getSeoPagePermission() {
  if (typeof window === 'undefined') return 'no access';
  const email = localStorage.getItem('admin-email');
  const superAdmin = process.env.NEXT_PUBLIC_SUPER_ADMIN;
  if (email && superAdmin && email === superAdmin) return 'all access';
  const perms = JSON.parse(localStorage.getItem('admin-permissions') || '{}');
  if (perms && perms.seo) {
    return perms.seo;
  }
  return 'no access';
}

interface Product {
  _id: string;
  name: string;
  img?: string;
  sku?: string;
}

interface Location {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

interface SeoData {
  _id?: string;
  product?: string | Product;
  location?: string | Location;
  slug?: string;
  title?: string;
  description?: string;
  excerpt?: string;
  keywords?: string;
  canonical_url?: string;
  noindex?: boolean;
  nofollow?: boolean;
  priority?: number;
  [key: string]: unknown;
}

function SeoPage() {
  const [seoList, setSeoList] = useState<SeoData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<SeoData>({});
  const [submitting, setSubmitting] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedSeo, setSelectedSeo] = useState<SeoData | null>(null);
  const [pageAccess, setPageAccess] = useState<'all access' | 'only view' | 'no access'>('no access');
  const [selectedSeos, setSelectedSeos] = useState<SeoData[]>([]);

  // Fetch SEO list
  const fetchSeo = useCallback(() => {
    setLoading(true);
    apiFetch(`${API_URL}/seo?page=1&limit=100&populate=product,location`)
      .then(res => res.json())
      .then(data => {
        setSeoList(data.data || []);
      })
      .catch(error => {
        console.error('Error fetching SEO:', error);
        setSeoList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSeo();
    setPageAccess(getSeoPagePermission());

    // Fetch products
    apiFetch(`${API_URL}/product?limit=100`)
      .then(res => res.json())
      .then(data => {
        const products = data.data || [];
        products.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
        setProducts(products);
      })
      .catch(error => console.error('Error fetching products:', error));

    // Fetch locations
    apiFetch(`${API_URL}/locations?limit=1000`)
      .then(res => res.json())
      .then(data => {
        const locationsData = data.data?.locations || data.data || [];
        locationsData.sort((a: Location, b: Location) => a.name.localeCompare(b.name));
        setLocations(locationsData);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, [fetchSeo]);

  // Define columns for EnhancedDataTable
  const columns: Column<SeoData>[] = useMemo(() => [
    {
      id: 'product',
      label: 'Product',
      sortable: true,
      filterable: true,
      getValue: (row: SeoData) => {
        const prod = row.product;
        if (typeof prod === 'object' && prod !== null && 'name' in prod) {
          return (prod as Product).name || '';
        }
        // If it's just an ID string, try to find the product
        if (typeof prod === 'string') {
          const foundProduct = products.find(p => p._id === prod);
          return foundProduct?.name || '';
        }
        return '';
      },
      format: (_value: unknown, row: SeoData) => {
        const prod = row.product;
        
        // Handle populated product object
        if (typeof prod === 'object' && prod !== null && 'name' in prod) {
          const product = prod as Product;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {product.img && (
                <Box 
                  component="img"
                  src={`${API_URL}/images/${product.img}`} 
                  alt={product.name || 'Product'}
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    objectFit: 'cover',
                    bgcolor: '#f5f5f5',
                    border: '1px solid #e0e0e0'
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <Typography variant="body2">{product.name}</Typography>
            </Box>
          );
        }
        
        // Handle product ID string - find product from products list
        if (typeof prod === 'string') {
          const foundProduct = products.find(p => p._id === prod);
          if (foundProduct) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {foundProduct.img && (
                  <Box 
                    component="img"
                    src={`${API_URL}/images/${foundProduct.img}`} 
                    alt={foundProduct.name || 'Product'}
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 1, 
                      objectFit: 'cover',
                      bgcolor: '#f5f5f5',
                      border: '1px solid #e0e0e0'
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <Typography variant="body2">{foundProduct.name}</Typography>
              </Box>
            );
          }
        }
        
        return <Typography variant="body2">-</Typography>;
      },
    },
    {
      id: 'location',
      label: 'Location',
      sortable: true,
      filterable: true,
      getValue: (row: SeoData) => {
        const loc = row.location;
        if (typeof loc === 'object' && loc !== null && 'name' in loc) {
          return (loc as Location).name || '';
        }
        // If it's just an ID string, try to find the location
        if (typeof loc === 'string') {
          const foundLocation = locations.find(l => l._id === loc);
          return foundLocation?.name || '';
        }
        return '';
      },
      format: (_value: unknown, row: SeoData) => {
        const loc = row.location;
        
        // Handle populated location object
        if (typeof loc === 'object' && loc !== null && 'name' in loc) {
          const location = loc as Location;
          return <Typography variant="body2">{location.name}</Typography>;
        }
        
        // Handle location ID string - find location from locations list
        if (typeof loc === 'string') {
          const foundLocation = locations.find(l => l._id === loc);
          if (foundLocation) {
            return <Typography variant="body2">{foundLocation.name}</Typography>;
          }
        }
        
        return <Typography variant="body2">-</Typography>;
      },
    },
    {
      id: 'slug',
      label: 'Slug',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.slug || '-',
    },
    {
      id: 'excerpt',
      label: 'Excerpt',
      format: (_value: unknown, row: SeoData) => {
        const excerpt = row.excerpt as string;
        return excerpt ? (excerpt.length > 50 ? excerpt.substring(0, 50) + '...' : excerpt) : '-';
      },
    },
    {
      id: 'keywords',
      label: 'Keywords',
      format: (_value: unknown, row: SeoData) => row.keywords || '-',
    },
    {
      id: 'canonical_url',
      label: 'Canonical URL',
      format: (_value: unknown, row: SeoData) => row.canonical_url || '-',
    },
  ], [products, locations]);

  // Statistics
  const stats = useMemo(() => {
    const total = seoList.length;
    const withExcerpt = seoList.filter(s => s.excerpt).length;
    const withKeywords = seoList.filter(s => s.keywords).length;

    return {
      total,
      withExcerpt,
      withKeywords,
    };
  }, [seoList]);

  // Handlers for EnhancedDataTable
  const handleAdd = useCallback(() => {
    setForm({});
    setEditId(null);
    setOpen(true);
  }, []);

  const handleEdit = useCallback((seo: SeoData) => {
    setEditId(seo._id as string);
    
    // Extract IDs from populated fields
    const formData: SeoData = {
      ...seo,
      product: typeof seo.product === 'object' && seo.product ? (seo.product as Product)._id : seo.product,
      location: typeof seo.location === 'object' && seo.location ? (seo.location as Location)._id : seo.location,
    };
    
    setForm(formData);
    setOpen(true);
  }, []);

  const handleDeleteSeo = useCallback(async (seo: SeoData) => {
    if (!seo._id) return;

    if (confirm(`Are you sure you want to delete this SEO entry?`)) {
      try {
        const res = await apiFetch(`${API_URL}/seo/${seo._id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchSeo();
          alert('SEO entry deleted successfully!');
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while deleting");
      }
    }
  }, [fetchSeo]);

  const handleView = useCallback((seo: SeoData) => {
    setSelectedSeo(seo);
    setViewOpen(true);
  }, []);

  const handleExportSelected = useCallback(() => {
    if (selectedSeos.length === 0) return;

    const dataStr = JSON.stringify(selectedSeos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seo-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert(`Exported ${selectedSeos.length} SEO entries successfully!`);
  }, [selectedSeos]);

  const handleSaveFromView = useCallback(async (updatedSeo: SeoData) => {
    try {
      const response = await apiFetch(`${API_URL}/seo/${updatedSeo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSeo)
      });

      if (response.ok) {
        await fetchSeo();
        setViewOpen(false);
        setSelectedSeo(null);
        alert('SEO entry updated successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update SEO entry');
      }
    } catch (error) {
      console.error('Error updating SEO:', error);
      alert('An error occurred while updating');
    }
  }, [fetchSeo]);

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setForm({});
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const url = editId ? `${API_URL}/seo/${editId}` : `${API_URL}/seo`;
      const method = editId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Failed to save SEO data');
      }

      await fetchSeo();
      handleClose();
      alert(editId ? 'SEO entry updated successfully!' : 'SEO entry created successfully!');
    } catch (error) {
      console.error('Error saving SEO data:', error);
      alert('An error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  // Render
  if (pageAccess === 'no access') {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ color: '#e74c3c', mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
          You don&apos;t have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {pageAccess === 'only view' && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ p: 2, bgcolor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 2 }}>
            <Typography color="#ad6800" fontWeight={600}>
              You have view-only access. To make changes, contact your admin.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            🔍 SEO Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage SEO settings for your products and locations with advanced filtering
          </Typography>
        </Box>

        {/* Bulk Actions */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleExportSelected}
            disabled={selectedSeos.length === 0 || pageAccess === 'only view'}
          >
            Export ({selectedSeos.length})
          </Button>
          <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={pageAccess === 'only view'}
          >
            Add New SEO Entry
          </Button>
        </Box>
      </Box>

      {/* Data Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <EnhancedDataTable
          columns={columns}
          data={seoList}
          selectable
          onSelectionChange={setSelectedSeos}
          onEdit={pageAccess === 'only view' ? undefined : handleEdit}
          onDelete={pageAccess === 'only view' ? undefined : handleDeleteSeo}
          onView={handleView}
          enableColumnFilters
          enableColumnManagement
          rowsPerPage={15}
          searchPlaceholder="Search by product, location, slug, keywords..."
          storageKey="seo-table"
        />
      )}

      {/* Add/Edit Dialog */}
      <SeoFormDialog
        open={open}
        onClose={handleClose}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        editId={editId}
        submitting={submitting}
        pageAccess={pageAccess}
        products={products}
        locations={locations}
        API_URL={API_URL || ''}
      />

      {/* View Dialog */}
      <SeoViewDialog
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedSeo(null);
        }}
        seo={selectedSeo}
        onSave={handleSaveFromView}
        pageAccess={pageAccess}
        products={products}
        locations={locations}
        API_URL={API_URL || ''}
      />
    </Box>
  );
}

export default SeoPage;

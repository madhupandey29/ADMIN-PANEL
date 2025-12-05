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

  // core meta
  title?: string;
  description?: string;
  excerpt?: string;
  keywords?: string;
  canonical_url?: string;

  // product × location content
  productlocationtitle?: string;
  productlocationtagline?: string;
  productlocationdescription1?: string;
  productlocationdescription2?: string;

  // OG/Twitter combined meta
  meta_og_twitter_title_product_location?: string;
  meta_og_twitter_description_product_location?: string;

  // language / locale
  contentLanguage?: string;
  ogLocale?: string;

  // video OG
  ogVideoUrl?: string;
  ogVideoSecureUrl?: string;
  ogVideoType?: string;
  ogVideoWidth?: number;
  ogVideoHeight?: number;

  // twitter player
  twitterPlayer?: string;
  twitterPlayerWidth?: number;
  twitterPlayerHeight?: number;

  // JSON-LD
  VideoJsonLd?: string;

  // extra flags
  noindex?: boolean;
  nofollow?: boolean;
  priority?: number;

  // in case you use these flags from SEO schema
  popularproduct?: boolean;
  topratedproduct?: boolean;
  landingPageProduct?: boolean;
  shopyProduct?: boolean;

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
    // PRODUCT
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
        if (typeof prod === 'string') {
          const foundProduct = products.find(p => p._id === prod);
          return foundProduct?.name || '';
        }
        return '';
      },
      format: (_value: unknown, row: SeoData) => {
        const prod = row.product;
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

    // LOCATION
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
        if (typeof loc === 'string') {
          const foundLocation = locations.find(l => l._id === loc);
          return foundLocation?.name || '';
        }
        return '';
      },
      format: (_value: unknown, row: SeoData) => {
        const loc = row.location;
        if (typeof loc === 'object' && loc !== null && 'name' in loc) {
          const location = loc as Location;
          return <Typography variant="body2">{location.name}</Typography>;
        }
        if (typeof loc === 'string') {
          const foundLocation = locations.find(l => l._id === loc);
          if (foundLocation) {
            return <Typography variant="body2">{foundLocation.name}</Typography>;
          }
        }
        return <Typography variant="body2">-</Typography>;
      },
    },

    // CORE URL
    {
      id: 'slug',
      label: 'Slug',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.slug || '-',
    },
    {
      id: 'canonical_url',
      label: 'Canonical URL',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.canonical_url || '-',
    },

    // META TITLE / DESCRIPTION
    {
      id: 'title',
      label: 'Meta Title',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.title || '-',
    },
    {
      id: 'description',
      label: 'Meta Description',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => {
        const desc = row.description as string;
        if (!desc) return '-';
        return desc.length > 80 ? `${desc.substring(0, 80)}…` : desc;
      },
    },
    {
      id: 'excerpt',
      label: 'Excerpt',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => {
        const excerpt = row.excerpt as string;
        return excerpt ? (excerpt.length > 50 ? excerpt.substring(0, 50) + '…' : excerpt) : '-';
      },
    },
    {
      id: 'keywords',
      label: 'Keywords',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.keywords || '-',
    },

    // PRODUCT × LOCATION TITLE / TAGLINE
    {
      id: 'productlocationtitle',
      label: 'Product Location Title',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.productlocationtitle || '-',
    },
    {
      id: 'productlocationtagline',
      label: 'Product Location Tagline',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.productlocationtagline || '-',
    },

    // PRODUCT × LOCATION DESCRIPTIONS (SHORT PREVIEW)
    {
      id: 'productlocationdescription1',
      label: 'Description 1 (short)',
      sortable: false,
      filterable: false,
      format: (_value: unknown, row: SeoData) => {
        const d = row.productlocationdescription1 as string;
        if (!d) return '-';
        const text = d.replace(/<[^>]+>/g, ''); // strip HTML tags for preview
        return text.length > 80 ? text.substring(0, 80) + '…' : text;
      },
    },
    {
      id: 'productlocationdescription2',
      label: 'Description 2 (short)',
      sortable: false,
      filterable: false,
      format: (_value: unknown, row: SeoData) => {
        const d = row.productlocationdescription2 as string;
        if (!d) return '-';
        const text = d.replace(/<[^>]+>/g, '');
        return text.length > 80 ? text.substring(0, 80) + '…' : text;
      },
    },

    // OG + TWITTER META TITLE / DESCRIPTION
    {
      id: 'meta_og_twitter_title_product_location',
      label: 'OG/Twitter Title (P×L)',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        row.meta_og_twitter_title_product_location || '-',
    },
    {
      id: 'meta_og_twitter_description_product_location',
      label: 'OG/Twitter Description (P×L)',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => {
        const d = row.meta_og_twitter_description_product_location as string;
        if (!d) return '-';
        return d.length > 80 ? d.substring(0, 80) + '…' : d;
      },
    },

    // LANGUAGE / LOCALE
    {
      id: 'contentLanguage',
      label: 'Content Language',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.contentLanguage || '-',
    },
    {
      id: 'ogLocale',
      label: 'OG Locale',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.ogLocale || '-',
    },

    // VIDEO: OG URL FIELDS
    {
      id: 'ogVideoUrl',
      label: 'OG Video URL',
      sortable: false,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.ogVideoUrl || '-',
    },
    {
      id: 'ogVideoSecureUrl',
      label: 'OG Video Secure URL',
      sortable: false,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.ogVideoSecureUrl || '-',
    },
    {
      id: 'ogVideoType',
      label: 'OG Video Type',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.ogVideoType || '-',
    },
    {
      id: 'ogVideoWidth',
      label: 'OG Video Width',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        typeof row.ogVideoWidth === 'number' ? row.ogVideoWidth : '-',
    },
    {
      id: 'ogVideoHeight',
      label: 'OG Video Height',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        typeof row.ogVideoHeight === 'number' ? row.ogVideoHeight : '-',
    },

    // TWITTER PLAYER
    {
      id: 'twitterPlayer',
      label: 'Twitter Player URL',
      sortable: false,
      filterable: true,
      format: (_value: unknown, row: SeoData) => row.twitterPlayer || '-',
    },
    {
      id: 'twitterPlayerWidth',
      label: 'Twitter Width',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        typeof row.twitterPlayerWidth === 'number' ? row.twitterPlayerWidth : '-',
    },
    {
      id: 'twitterPlayerHeight',
      label: 'Twitter Height',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        typeof row.twitterPlayerHeight === 'number' ? row.twitterPlayerHeight : '-',
    },

    // JSON-LD (PREVIEW)
    {
      id: 'VideoJsonLd',
      label: 'Video JSON-LD (short)',
      sortable: false,
      filterable: false,
      format: (_value: unknown, row: SeoData) => {
        const d = row.VideoJsonLd as string;
        if (!d) return '-';
        return d.length > 80 ? d.substring(0, 80) + '…' : d;
      },
    },

    // FLAGS: NOINDEX / NOFOLLOW / PRIORITY
    {
      id: 'noindex',
      label: 'No Index',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        row.noindex ? (
          <Chip label="No Index" size="small" color="error" />
        ) : (
          <Chip label="Index" size="small" color="success" />
        ),
    },
    {
      id: 'nofollow',
      label: 'No Follow',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        row.nofollow ? (
          <Chip label="No Follow" size="small" color="error" />
        ) : (
          <Chip label="Follow" size="small" color="success" />
        ),
    },
    {
      id: 'priority',
      label: 'Priority',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        typeof row.priority === 'number' ? row.priority.toFixed(1) : '-',
    },

    // FLAGS: POPULAR / TOP / LANDING / SHOPY
    {
      id: 'popularproduct',
      label: 'Popular',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        row.popularproduct ? (
          <Chip label="Popular" size="small" color="success" />
        ) : (
          <Chip label="-" size="small" />
        ),
    },
    {
      id: 'topratedproduct',
      label: 'Top Rated',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        row.topratedproduct ? (
          <Chip label="Top Rated" size="small" color="primary" />
        ) : (
          <Chip label="-" size="small" />
        ),
    },
    {
      id: 'landingPageProduct',
      label: 'Landing Page',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        row.landingPageProduct ? (
          <Chip label="Landing" size="small" color="secondary" />
        ) : (
          <Chip label="-" size="small" />
        ),
    },
    {
      id: 'shopyProduct',
      label: 'Shopy Product',
      sortable: true,
      filterable: true,
      format: (_value: unknown, row: SeoData) =>
        row.shopyProduct ? (
          <Chip label="Shopy" size="small" color="secondary" />
        ) : (
          <Chip label="-" size="small" />
        ),
    },
  ], [products, locations]);

  // Statistics (optional – you can extend to use new fields if you want)
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

  // Handlers
  const handleAdd = useCallback(() => {
    setForm({});
    setEditId(null);
    setOpen(true);
  }, []);

  const handleEdit = useCallback((seo: SeoData) => {
    setEditId(seo._id as string);
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
  🔍 Product × Location SEO
</Typography>
<Typography variant="body2" color="text.secondary">
  Manage SEO for product × location landing pages
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
  Add Product × Location SEO
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

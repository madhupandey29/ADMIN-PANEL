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
import StaticSeoFormDialog from './StaticSeoFormDialog';
import StaticSeoViewDialog from './StaticSeoViewDialog';

interface TopicPageSEO {
  _id?: string;
  name: string;
  slug?: string;
  producttag?: string | string[];
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  canonical_url?: string;
  excerpt?: string;
  description_html?: string;
  contentLanguage?: string;
  ogLocale?: string;
  og_twitter_Title?: string;
  og_twitter_Description?: string;
  ogType?: string;
  openGraph?: {
    images?: string[];
    video?: {
      url?: string;
      secure_url?: string;
      type?: string;
      width?: number;
      height?: number;
    };
  };
  twitterCard?: string;
  twitter?: {
    image?: string;
    player?: string;
    player_width?: number;
    player_height?: number;
  };
  VideoJsonLd?: string;
  status?: 'draft' | 'published' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: string | number | boolean | undefined | null | Date | Record<string, unknown> | Array<unknown>;
}

function getTopicPageSeoPermission() {
  if (typeof window === 'undefined') return 'no access';

  try {
    const email = localStorage.getItem('admin-email');
    const superAdmin = process.env.NEXT_PUBLIC_SUPER_ADMIN;
    if (email && superAdmin && email === superAdmin) return 'all access';

    const perms = JSON.parse(localStorage.getItem('admin-permissions') || '{}');
    if (perms && perms.seo) {
      return perms.seo;
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
  }

  return 'no access';
}

export default function TopicPageSeoPage() {
  const [topicPageSeos, setTopicPageSeos] = useState<Partial<TopicPageSEO>[]>([]);
  const [selectedSeos, setSelectedSeos] = useState<Partial<TopicPageSEO>[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageAccess, setPageAccess] = useState<'all access' | 'only view' | 'no access'>('no access');
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedSeo, setSelectedSeo] = useState<Partial<TopicPageSEO> | null>(null);
  const [availableProductTags, setAvailableProductTags] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TopicPageSEO>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPageAccess(getTopicPageSeoPermission());
  }, []);

  const fetchTopicPageSeos = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = `/topicpage-seo`;

      const response = await apiFetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTopicPageSeos(data.data || []);
    } catch (error) {
      console.error('Error fetching topic page SEOs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductTags = useCallback(async () => {
    try {
      const res = await apiFetch('/product?fields=productTag');
      if (!res.ok) return;
      const json = await res.json().catch(() => ({}));
      const products = json.data || [];
      const allTags: string[] = [];
      for (const p of products) {
        if (Array.isArray(p.productTag)) {
          for (const t of p.productTag) {
            if (t && typeof t === 'string') allTags.push(t.trim());
          }
        }
      }
      const unique = Array.from(new Set(allTags)).filter(Boolean);
      setAvailableProductTags(unique.sort((a, b) => a.localeCompare(b)));
    } catch (err) {
      console.error('Error fetching product tags:', err);
    }
  }, []);

  useEffect(() => {
    fetchTopicPageSeos();
    fetchProductTags();
  }, [fetchTopicPageSeos, fetchProductTags]);

  // Define columns for EnhancedDataTable
  const columns: Column<Partial<TopicPageSEO>>[] = useMemo(() => [
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      filterable: true,
      format: (value, seo) => seo.name || '-',
    },
    {
      id: 'slug',
      label: 'Slug',
      sortable: true,
      filterable: true,
      format: (value, seo) => seo.slug || '-',
    },
    {
      id: 'meta_title',
      label: 'Meta Title',
      sortable: true,
      filterable: true,
      format: (value, seo) => seo.meta_title || '-',
    },
    {
      id: 'producttag',
      label: 'Product Tags',
      format: (value, seo) => {
        const tags = seo.producttag;
        if (!tags) return '-';
        const tagArray = Array.isArray(tags) ? tags : [tags];
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {tagArray.map((tag, index) => (
              <Chip key={index} label={tag} size="small" sx={{ fontSize: '11px' }} />
            ))}
          </Box>
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      format: (value, seo) => (
        <Chip
          label={seo.status || 'draft'}
          color={
            seo.status === 'published'
              ? 'success'
              : seo.status === 'archived'
                ? 'default'
                : 'warning'
          }
          size="small"
        />
      ),
    },
  ], []);

  // Statistics
  const stats = useMemo(() => {
    const total = topicPageSeos.length;
    const published = topicPageSeos.filter(s => s.status === 'published').length;
    const draft = topicPageSeos.filter(s => s.status === 'draft').length;
    const archived = topicPageSeos.filter(s => s.status === 'archived').length;
    const withTags = topicPageSeos.filter(s => s.producttag && (Array.isArray(s.producttag) ? s.producttag.length > 0 : true)).length;

    return { total, published, draft, archived, withTags };
  }, [topicPageSeos]);

  const handleAdd = useCallback(() => {
    setForm({ status: 'draft' });
    setEditId(null);
    setOpen(true);
  }, []);

  const handleEdit = useCallback((seo: Partial<TopicPageSEO>) => {
    setEditId(seo._id as string);
    setForm(seo);
    setOpen(true);
  }, []);

  const handleView = useCallback((seo: Partial<TopicPageSEO>) => {
    setSelectedSeo(seo);
    setViewOpen(true);
  }, []);

  const handleViewClose = useCallback(() => {
    setViewOpen(false);
    setSelectedSeo(null);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setForm({});
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const url = editId ? `/topicpage-seo/${editId}` : `/topicpage-seo`;
      const method = editId ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Failed to save SEO data');
      }

      await fetchTopicPageSeos();
      handleClose();
      alert(editId ? 'SEO entry updated successfully!' : 'SEO entry created successfully!');
    } catch (error) {
      console.error('Error saving SEO data:', error);
      alert('An error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveFromView = useCallback(async (updatedSeo: Partial<TopicPageSEO>) => {
    try {
      const response = await apiFetch(`/topicpage-seo/${updatedSeo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSeo)
      });

      if (response.ok) {
        await fetchTopicPageSeos();
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
  }, [fetchTopicPageSeos]);

  const handleDelete = useCallback(async (seo: Partial<TopicPageSEO>) => {
    if (!seo._id) return;

    if (confirm(`Are you sure you want to delete "${seo.name}"?`)) {
      try {
        await apiFetch(`/topicpage-seo/${seo._id}`, { method: 'DELETE' });
        fetchTopicPageSeos();
        alert(`SEO entry "${seo.name}" deleted successfully!`);
      } catch (error) {
        console.error('Error deleting topic page SEO:', error);
        alert('Failed to delete topic page SEO');
      }
    }
  }, [fetchTopicPageSeos]);

  const handleExportSelected = useCallback(() => {
    if (selectedSeos.length === 0) return;

    const dataStr = JSON.stringify(selectedSeos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `static-seo-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert(`Exported ${selectedSeos.length} SEO entries successfully!`);
  }, [selectedSeos]);

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

      {/* Header Section */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            🔍 Static SEO Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your static SEO entries with advanced filtering and sorting
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
          data={topicPageSeos}
          selectable
          onSelectionChange={setSelectedSeos}
          onEdit={pageAccess === 'only view' ? undefined : handleEdit}
          onDelete={pageAccess === 'only view' ? undefined : handleDelete}
          onView={handleView}
          enableColumnFilters
          enableColumnManagement
          rowsPerPage={15}
          searchPlaceholder="Search by name, slug, meta title..."
          storageKey="static-seo-table"
        />
      )}

      {/* Add/Edit Dialog */}
      <StaticSeoFormDialog
        open={open}
        onClose={handleClose}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        editId={editId}
        submitting={submitting}
        pageAccess={pageAccess}
        availableProductTags={availableProductTags}
      />

      {/* View Dialog */}
      <StaticSeoViewDialog
        open={viewOpen}
        onClose={handleViewClose}
        seo={selectedSeo}
        onSave={handleSaveFromView}
        pageAccess={pageAccess}
        availableProductTags={availableProductTags}
      />
    </Box>
  );
}

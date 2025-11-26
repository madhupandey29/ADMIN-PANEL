# Enhanced Components Usage Guide

## 📋 EnhancedDataTable

A powerful, feature-rich data table component with sorting, filtering, pagination, and more.

### Basic Usage

```tsx
import { EnhancedDataTable, Column } from '@/components';

const columns: Column[] = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', type: 'text' },
  { id: 'status', label: 'Status', type: 'chip' },
];

function MyPage() {
  const [data, setData] = useState([]);

  return (
    <EnhancedDataTable
      columns={columns}
      data={data}
      onEdit={(row) => console.log('Edit', row)}
      onDelete={(row) => console.log('Delete', row)}
      onView={(row) => console.log('View', row)}
    />
  );
}
```

### Advanced Usage with All Features

```tsx
import { EnhancedDataTable, Column, Action } from '@/components';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';

const columns: Column[] = [
  {
    id: 'image',
    label: 'Image',
    type: 'image',
    minWidth: 80,
    sortable: false,
  },
  {
    id: 'name',
    label: 'Product Name',
    sortable: true,
    filterable: true,
  },
  {
    id: 'category',
    label: 'Category',
    format: (value) => value?.name || '-',
  },
  {
    id: 'price',
    label: 'Price',
    type: 'number',
    align: 'right',
    format: (value) => `$${value.toFixed(2)}`,
  },
  {
    id: 'active',
    label: 'Active',
    type: 'boolean',
  },
  {
    id: 'createdAt',
    label: 'Created',
    type: 'date',
  },
];

const customActions: Action[] = [
  {
    icon: <DownloadIcon />,
    label: 'Download',
    onClick: (row) => downloadProduct(row),
    color: 'primary',
  },
  {
    icon: <ShareIcon />,
    label: 'Share',
    onClick: (row) => shareProduct(row),
    color: 'info',
    show: (row) => row.published, // Only show for published items
  },
];

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  return (
    <EnhancedDataTable
      columns={columns}
      data={products}
      loading={loading}
      
      // Actions
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      customActions={customActions}
      
      // Selection
      selectable
      onSelectionChange={setSelected}
      
      // Pagination
      rowsPerPage={10}
      showPagination
      
      // Search
      searchable
      searchPlaceholder="Search products..."
      
      // Styling
      dense
      stickyHeader
      
      // Row interactions
      onRowClick={(row) => console.log('Row clicked', row)}
      getRowId={(row) => row._id}
      rowClassName={(row) => row.featured ? 'featured-row' : ''}
      
      // Empty state
      emptyMessage="No products found"
    />
  );
}
```

### Column Types

```tsx
// Text (default)
{ id: 'name', label: 'Name', type: 'text' }

// Number
{ id: 'price', label: 'Price', type: 'number', align: 'right' }

// Date
{ id: 'createdAt', label: 'Created', type: 'date' }

// Boolean (shows Yes/No chip)
{ id: 'active', label: 'Active', type: 'boolean' }

// Image (shows thumbnail)
{ id: 'image', label: 'Image', type: 'image' }

// Chip (colored badge)
{ id: 'status', label: 'Status', type: 'chip' }

// Custom formatter
{
  id: 'price',
  label: 'Price',
  format: (value, row) => `$${value.toFixed(2)} ${row.currency}`
}
```

---

## 📝 EnhancedFormDialog

A flexible form dialog with support for multiple field types, validation, and sections.

### Basic Usage

```tsx
import { EnhancedFormDialog, FormField } from '@/components';

const fields: FormField[] = [
  {
    name: 'name',
    label: 'Product Name',
    type: 'text',
    required: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 4,
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    min: 0,
    step: 0.01,
  },
];

function MyPage() {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data) => {
    console.log('Form data:', data);
    // API call here
  };

  return (
    <EnhancedFormDialog
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit}
      title="Add Product"
      fields={fields}
    />
  );
}
```

### Advanced Usage with Sections

```tsx
import { EnhancedFormDialog, FormSection } from '@/components';

const sections: FormSection[] = [
  {
    title: 'Basic Information',
    description: 'Enter the basic product details',
    fields: [
      {
        name: 'name',
        label: 'Product Name',
        type: 'text',
        required: true,
        gridSize: { xs: 12, md: 6 },
      },
      {
        name: 'sku',
        label: 'SKU',
        type: 'text',
        required: true,
        gridSize: { xs: 12, md: 6 },
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        rows: 4,
        gridSize: { xs: 12 },
      },
    ],
  },
  {
    title: 'Pricing',
    fields: [
      {
        name: 'price',
        label: 'Price',
        type: 'number',
        min: 0,
        step: 0.01,
        required: true,
        gridSize: { xs: 12, md: 6 },
      },
      {
        name: 'currency',
        label: 'Currency',
        type: 'select',
        options: [
          { label: 'USD', value: 'USD' },
          { label: 'EUR', value: 'EUR' },
          { label: 'INR', value: 'INR' },
        ],
        defaultValue: 'USD',
        gridSize: { xs: 12, md: 6 },
      },
    ],
  },
  {
    title: 'Media',
    fields: [
      {
        name: 'image',
        label: 'Product Image',
        type: 'image',
        accept: 'image/*',
        required: true,
      },
    ],
  },
];

function ProductForm() {
  const [open, setOpen] = useState(false);
  const [initialData, setInitialData] = useState({});

  const handleSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });
    
    // API call with FormData
    await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <EnhancedFormDialog
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={handleSubmit}
      title="Add Product"
      sections={sections}
      initialData={initialData}
      maxWidth="lg"
      submitLabel="Create Product"
      validateOnChange
    />
  );
}
```

### All Field Types

```tsx
const allFieldTypes: FormField[] = [
  // Text input
  { name: 'name', label: 'Name', type: 'text' },
  
  // Number input
  { name: 'age', label: 'Age', type: 'number', min: 0, max: 120 },
  
  // Email input
  { name: 'email', label: 'Email', type: 'email' },
  
  // Password input
  { name: 'password', label: 'Password', type: 'password' },
  
  // Textarea
  { name: 'description', label: 'Description', type: 'textarea', rows: 4 },
  
  // Select dropdown
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
    ],
  },
  
  // Multi-select
  {
    name: 'tags',
    label: 'Tags',
    type: 'multiselect',
    options: [
      { label: 'New', value: 'new' },
      { label: 'Featured', value: 'featured' },
      { label: 'Sale', value: 'sale' },
    ],
  },
  
  // Autocomplete
  {
    name: 'vendor',
    label: 'Vendor',
    type: 'autocomplete',
    options: [
      { label: 'Vendor A', value: 'vendor-a' },
      { label: 'Vendor B', value: 'vendor-b' },
    ],
  },
  
  // Checkbox
  { name: 'active', label: 'Active', type: 'checkbox' },
  
  // Switch
  { name: 'featured', label: 'Featured Product', type: 'switch' },
  
  // Date picker
  { name: 'releaseDate', label: 'Release Date', type: 'date' },
  
  // DateTime picker
  { name: 'publishAt', label: 'Publish At', type: 'datetime-local' },
  
  // Time picker
  { name: 'time', label: 'Time', type: 'time' },
  
  // File upload
  { name: 'document', label: 'Upload Document', type: 'file', accept: '.pdf,.doc' },
  
  // Image upload
  { name: 'image', label: 'Upload Image', type: 'image', accept: 'image/*' },
  
  // Color picker
  { name: 'color', label: 'Color', type: 'color' },
  
  // URL input
  { name: 'website', label: 'Website', type: 'url' },
  
  // Phone input
  { name: 'phone', label: 'Phone', type: 'tel' },
];
```

### Custom Validation

```tsx
const fields: FormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validation: (value) => {
      if (!value.includes('@company.com')) {
        return 'Must be a company email';
      }
      return null;
    },
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validation: (value) => {
      if (value.length < 8) {
        return 'Password must be at least 8 characters';
      }
      if (!/[A-Z]/.test(value)) {
        return 'Password must contain uppercase letter';
      }
      return null;
    },
  },
];
```

### Conditional Fields

```tsx
const fields: FormField[] = [
  {
    name: 'hasDiscount',
    label: 'Has Discount',
    type: 'checkbox',
  },
  {
    name: 'discountPercent',
    label: 'Discount %',
    type: 'number',
    min: 0,
    max: 100,
    showIf: (formData) => formData.hasDiscount === true,
  },
];
```

### Custom Field Rendering

```tsx
const fields: FormField[] = [
  {
    name: 'customField',
    label: 'Custom Field',
    type: 'custom',
    render: (value, onChange, formData) => (
      <Box>
        <Typography>Custom Component</Typography>
        <Slider
          value={value || 0}
          onChange={(_, newValue) => onChange(newValue)}
          min={0}
          max={100}
        />
      </Box>
    ),
  },
];
```

### Field Dependencies

```tsx
const fields: FormField[] = [
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    onChange: (value, formData) => {
      // Auto-calculate tax when price changes
      const tax = value * 0.1;
      // You can update other fields here
    },
  },
];
```

---

## 🎯 Complete Example: Product Management Page

```tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EnhancedDataTable, EnhancedFormDialog, Column, FormSection } from '@/components';
import { apiFetch } from '@/utils/apiFetch';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: { _id: string; name: string };
  image: string;
  active: boolean;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/product');
      const data = await res.json();
      setProducts(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await apiFetch('/category');
    const data = await res.json();
    setCategories(
      (data.data || []).map((cat: any) => ({
        label: cat.name,
        value: cat._id,
      }))
    );
  };

  const columns: Column<Product>[] = [
    {
      id: 'image',
      label: 'Image',
      type: 'image',
      minWidth: 80,
      sortable: false,
    },
    {
      id: 'name',
      label: 'Product Name',
      sortable: true,
      minWidth: 200,
    },
    {
      id: 'category',
      label: 'Category',
      format: (value) => value?.name || '-',
    },
    {
      id: 'price',
      label: 'Price',
      type: 'number',
      align: 'right',
      format: (value) => `$${value.toFixed(2)}`,
    },
    {
      id: 'active',
      label: 'Status',
      type: 'boolean',
    },
    {
      id: 'createdAt',
      label: 'Created',
      type: 'date',
    },
  ];

  const formSections: FormSection[] = [
    {
      title: 'Basic Information',
      fields: [
        {
          name: 'name',
          label: 'Product Name',
          type: 'text',
          required: true,
          gridSize: { xs: 12, md: 6 },
        },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          options: categories,
          required: true,
          gridSize: { xs: 12, md: 6 },
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 4,
          gridSize: { xs: 12 },
        },
      ],
    },
    {
      title: 'Pricing & Status',
      fields: [
        {
          name: 'price',
          label: 'Price',
          type: 'number',
          min: 0,
          step: 0.01,
          required: true,
          gridSize: { xs: 12, md: 6 },
        },
        {
          name: 'active',
          label: 'Active',
          type: 'switch',
          gridSize: { xs: 12, md: 6 },
        },
      ],
    },
    {
      title: 'Media',
      fields: [
        {
          name: 'image',
          label: 'Product Image',
          type: 'image',
          accept: 'image/*',
        },
      ],
    },
  ];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await apiFetch(`/product/${product._id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  const handleSubmit = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const url = editingProduct ? `/product/${editingProduct._id}` : '/product';
    const method = editingProduct ? 'PUT' : 'POST';

    await apiFetch(url, { method, body: formData });
    fetchProducts();
    setDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingProduct(null);
            setDialogOpen(true);
          }}
        >
          Add Product
        </Button>
      </Box>

      <EnhancedDataTable
        columns={columns}
        data={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchable
        searchPlaceholder="Search products..."
        rowsPerPage={10}
      />

      <EnhancedFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        sections={formSections}
        initialData={editingProduct || {}}
        maxWidth="md"
        validateOnChange
      />
    </Box>
  );
}
```

---

## 🎨 Styling & Customization

Both components follow your DattaAble theme and can be customized using MUI's `sx` prop or by modifying the component files directly.

### Custom Styling Example

```tsx
<EnhancedDataTable
  columns={columns}
  data={data}
  sx={{
    '& .MuiTableCell-head': {
      backgroundColor: 'primary.main',
      color: 'white',
    },
  }}
/>
```

---

## 📚 TypeScript Support

Both components are fully typed with TypeScript. Use the exported types for better IDE support:

```tsx
import type { Column, Action, FormField, FormSection, FieldType } from '@/components';
```

---

## 🚀 Performance Tips

1. **Memoize columns and fields** to prevent unnecessary re-renders
2. **Use `getRowId`** for efficient row identification
3. **Implement pagination** for large datasets
4. **Use `loading` prop** to show loading states
5. **Debounce search** for better performance (already implemented)

---

## 🐛 Troubleshooting

### Images not showing
- Ensure your image URLs are absolute or properly configured
- Check CORS settings if images are from external sources

### Form not submitting
- Check browser console for validation errors
- Ensure all required fields are filled
- Verify `onSubmit` function is async if making API calls

### Table not sorting
- Ensure `sortable` is not set to `false` on columns
- Check that data values are comparable (same type)

---

## 📝 Notes

- Both components are client-side only (`"use client"`)
- They integrate seamlessly with your existing MUI theme
- They follow your DattaAble design system
- They're production-ready and optimized for performance

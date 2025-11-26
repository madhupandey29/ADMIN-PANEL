# 🔄 Migration Guide: Refactoring Existing Pages

This guide shows you how to refactor your existing pages to use the new reusable components.

## 📋 Before You Start

1. ✅ Review `QUICK_REFERENCE.md` for syntax
2. ✅ Check `USAGE_EXAMPLES.md` for patterns
3. ✅ Visit `/example-page` for a working demo
4. ✅ Backup your current code (or use git)

## 🎯 Migration Strategy

### Step 1: Identify Refactorable Code

Look for these patterns in your existing pages:
- ❌ Manual table rendering with `<Table>`, `<TableRow>`, etc.
- ❌ Custom pagination logic
- ❌ Manual search/filter implementation
- ❌ Repetitive form dialogs
- ❌ Custom validation logic
- ❌ Image upload handling

### Step 2: Extract Data Structures

From your existing code, extract:
1. **Column definitions** → Convert to `Column[]`
2. **Form fields** → Convert to `FormField[]`
3. **Data fetching** → Keep as is
4. **Handlers** → Simplify

### Step 3: Replace Components

Replace old code with new components.

---

## 📝 Example Migration: Products Page

### BEFORE (Simplified - your actual code is longer)

```tsx
"use client";
import { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, TextField, IconButton, Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ name: '', price: '' });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  // Filter products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate
  const rowsPerPage = 10;
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({ name: product.name, price: product.price });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct 
      ? `/api/products/${editingProduct._id}`
      : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    fetchProducts();
    setOpen(false);
  };

  return (
    <div>
      <h1>Products</h1>
      <Button onClick={() => setOpen(true)}>Add Product</Button>
      
      {/* Search */}
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredProducts.length / rowsPerPage)}
        page={page}
        onChange={(_, value) => setPage(value)}
      />

      {/* Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <Button type="submit">Submit</Button>
        </form>
      </Dialog>
    </div>
  );
}
```

### AFTER (Using New Components)

```tsx
"use client";
import { useState, useEffect, useMemo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EnhancedDataTable, EnhancedFormDialog } from '@/components';
import type { Column, FormField } from '@/components';

interface Product {
  _id: string;
  name: string;
  price: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Define columns once
  const columns: Column<Product>[] = useMemo(() => [
    { id: 'name', label: 'Name', sortable: true },
    { 
      id: 'price', 
      label: 'Price', 
      type: 'number',
      format: (value) => `$${value.toFixed(2)}`
    },
  ], []);

  // Define form fields once
  const fields: FormField[] = useMemo(() => [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true, min: 0 },
  ], []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm('Delete this product?')) {
      await fetch(`/api/products/${product._id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  const handleSubmit = async (data: any) => {
    const url = editingProduct 
      ? `/api/products/${editingProduct._id}`
      : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    fetchProducts();
    setOpen(false);
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
            setOpen(true);
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
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        fields={fields}
        initialData={editingProduct || {}}
      />
    </Box>
  );
}
```

### 📊 Comparison

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Lines of Code | ~200 | ~80 | 60% reduction |
| Components | 15+ | 2 | 87% reduction |
| State Variables | 6 | 4 | 33% reduction |
| Manual Logic | Pagination, Search, Filter | None | 100% reduction |
| Type Safety | Partial | Full | ✅ Improved |
| Maintainability | Low | High | ✅ Improved |

---

## 🔧 Step-by-Step Migration

### 1. Install Component (Already Done)
```tsx
import { EnhancedDataTable, EnhancedFormDialog } from '@/components';
import type { Column, FormField } from '@/components';
```

### 2. Convert Table to EnhancedDataTable

#### Find Your Table Code
```tsx
<Table>
  <TableHead>
    <TableRow>
      <TableCell>Name</TableCell>
      <TableCell>Email</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {data.map(row => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Convert to Columns
```tsx
const columns: Column[] = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
];

<EnhancedDataTable columns={columns} data={data} />
```

### 3. Convert Form to EnhancedFormDialog

#### Find Your Form Code
```tsx
<Dialog open={open} onClose={handleClose}>
  <form onSubmit={handleSubmit}>
    <TextField
      label="Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
    />
    <TextField
      label="Email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
    />
    <Button type="submit">Submit</Button>
  </form>
</Dialog>
```

#### Convert to Fields
```tsx
const fields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
];

<EnhancedFormDialog
  open={open}
  onClose={handleClose}
  onSubmit={handleSubmit}
  title="Add Item"
  fields={fields}
/>
```

### 4. Remove Unnecessary Code

Delete these (now handled by components):
- ❌ Manual pagination logic
- ❌ Search/filter implementation
- ❌ Form state management
- ❌ Validation logic
- ❌ Loading skeletons
- ❌ Empty state handling

### 5. Simplify Handlers

#### Before
```tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  // Validation
  if (!form.name) return alert('Name required');
  if (!form.email) return alert('Email required');
  
  // Submit
  await fetch('/api/items', {
    method: 'POST',
    body: JSON.stringify(form)
  });
  
  // Reset
  setForm({ name: '', email: '' });
  setOpen(false);
  fetchData();
};
```

#### After
```tsx
const handleSubmit = async (data: any) => {
  await fetch('/api/items', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  fetchData();
};
```

---

## 🎯 Common Patterns

### Pattern 1: Image Upload

#### Before
```tsx
const [image, setImage] = useState(null);
const [preview, setPreview] = useState(null);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  setImage(file);
  setPreview(URL.createObjectURL(file));
};

<input type="file" onChange={handleImageChange} />
{preview && <img src={preview} />}
```

#### After
```tsx
const fields: FormField[] = [
  { name: 'image', label: 'Image', type: 'image', accept: 'image/*' }
];

const handleSubmit = async (data: any) => {
  const formData = new FormData();
  if (data.image instanceof File) {
    formData.append('image', data.image);
  }
  // Submit formData
};
```

### Pattern 2: Dropdown with API Data

#### Before
```tsx
const [categories, setCategories] = useState([]);

useEffect(() => {
  fetch('/api/categories').then(r => r.json()).then(setCategories);
}, []);

<Select value={form.category} onChange={...}>
  {categories.map(cat => (
    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
  ))}
</Select>
```

#### After
```tsx
const [categories, setCategories] = useState([]);

useEffect(() => {
  fetch('/api/categories')
    .then(r => r.json())
    .then(data => setCategories(
      data.map(cat => ({ label: cat.name, value: cat.id }))
    ));
}, []);

const fields: FormField[] = [
  { 
    name: 'category', 
    label: 'Category', 
    type: 'select',
    options: categories 
  }
];
```

### Pattern 3: Conditional Fields

#### Before
```tsx
{form.hasDiscount && (
  <TextField
    label="Discount"
    value={form.discount}
    onChange={...}
  />
)}
```

#### After
```tsx
const fields: FormField[] = [
  { name: 'hasDiscount', label: 'Has Discount', type: 'checkbox' },
  {
    name: 'discount',
    label: 'Discount',
    type: 'number',
    showIf: (data) => data.hasDiscount === true
  }
];
```

---

## ✅ Migration Checklist

For each page you migrate:

- [ ] Import new components
- [ ] Define column structure
- [ ] Define form fields
- [ ] Replace table with EnhancedDataTable
- [ ] Replace form with EnhancedFormDialog
- [ ] Simplify handlers
- [ ] Remove unnecessary state
- [ ] Remove manual pagination
- [ ] Remove manual search
- [ ] Remove manual validation
- [ ] Test all functionality
- [ ] Check TypeScript errors
- [ ] Verify responsive design
- [ ] Test on mobile

---

## 🚨 Common Pitfalls

### 1. Forgetting to Memoize
```tsx
// ❌ Bad - recreates on every render
const columns = [{ id: 'name', label: 'Name' }];

// ✅ Good - memoized
const columns = useMemo(() => [{ id: 'name', label: 'Name' }], []);
```

### 2. Not Handling File Uploads
```tsx
// ❌ Bad - sends File object as JSON
await fetch('/api', {
  body: JSON.stringify(data) // File becomes {}
});

// ✅ Good - uses FormData
const formData = new FormData();
Object.entries(data).forEach(([key, value]) => {
  if (value instanceof File) {
    formData.append(key, value);
  } else {
    formData.append(key, String(value));
  }
});
await fetch('/api', { body: formData });
```

### 3. Incorrect Column IDs
```tsx
// ❌ Bad - column id doesn't match data
const columns = [{ id: 'fullName', label: 'Name' }];
const data = [{ name: 'John' }]; // Should be 'fullName'

// ✅ Good - matching ids
const columns = [{ id: 'name', label: 'Name' }];
const data = [{ name: 'John' }];
```

---

## 📈 Migration Priority

Migrate pages in this order:

1. **Simple CRUD pages** (easiest)
   - Category, Color, Vendor, etc.
   
2. **Medium complexity** (moderate)
   - Products (with images)
   - Users (with roles)
   
3. **Complex pages** (hardest)
   - SEO (multiple relationships)
   - Orders (complex data)

---

## 🎓 Learning Path

1. **Day 1**: Read documentation
   - QUICK_REFERENCE.md
   - USAGE_EXAMPLES.md
   
2. **Day 2**: Try example page
   - Visit `/example-page`
   - Experiment with features
   
3. **Day 3**: Migrate first page
   - Pick simplest page
   - Follow this guide
   
4. **Day 4+**: Migrate remaining pages
   - One page at a time
   - Test thoroughly

---

## 💡 Tips

1. **Start Small**: Migrate one simple page first
2. **Keep Old Code**: Comment out instead of deleting initially
3. **Test Thoroughly**: Check all CRUD operations
4. **Use TypeScript**: Let types guide you
5. **Ask for Help**: Check documentation when stuck

---

## 🎉 Success Metrics

After migration, you should see:
- ✅ 50-70% less code
- ✅ Consistent UI across pages
- ✅ Faster development
- ✅ Fewer bugs
- ✅ Better maintainability
- ✅ Improved type safety

---

## 📞 Need Help?

1. Check `QUICK_REFERENCE.md` for syntax
2. See `USAGE_EXAMPLES.md` for patterns
3. Visit `/example-page` for working code
4. Review component source code
5. Check TypeScript errors for hints

---

**Happy Migrating!** 🚀

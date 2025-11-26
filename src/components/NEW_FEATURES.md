# 🎉 New Features: Excel-like Filtering & Column Management

## Overview

The EnhancedDataTable now includes two powerful new features:
1. **Excel-like Column Filtering** - Filter data by individual columns with multiple operators
2. **Column Management** - Show/hide columns dynamically

---

## 🔍 Excel-like Column Filtering

### Features

- **Per-column filters** with filter icon in each column header
- **Multiple filter types** based on column data type:
  - **Text**: Contains, Equals, Starts with, Ends with
  - **Number**: Equals, Greater than, Less than, Greater or equal, Less or equal
  - **Select/Chip**: Dropdown with unique values
  - **Boolean**: Yes/No dropdown
  - **Date**: Date picker
- **Active filter badge** showing count of active filters
- **Clear individual filters** or clear all at once
- **Persistent filtering** - filters remain active while sorting/searching

### Usage

```tsx
<EnhancedDataTable
  columns={columns}
  data={data}
  enableColumnFilters  // Enable filtering feature
/>
```

### Example

```tsx
const columns: Column[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'age', label: 'Age', type: 'number' },
  { id: 'status', label: 'Status', type: 'chip' },
  { id: 'active', label: 'Active', type: 'boolean' },
  { id: 'createdAt', label: 'Created', type: 'date' },
];

<EnhancedDataTable
  columns={columns}
  data={data}
  enableColumnFilters
/>
```

### Filter Types by Column Type

| Column Type | Filter UI | Operators |
|-------------|-----------|-----------|
| `text` | Text input + Operator dropdown | Contains, Equals, Starts with, Ends with |
| `number` | Number input + Operator dropdown | =, >, <, ≥, ≤ |
| `chip` / `select` | Dropdown with unique values | Equals |
| `boolean` | Yes/No dropdown | Equals |
| `date` | Date picker | Equals |

### Disable Filtering for Specific Columns

```tsx
const columns: Column[] = [
  { id: 'name', label: 'Name', filterable: true },  // Filterable
  { id: 'actions', label: 'Actions', filterable: false },  // Not filterable
];
```

### How It Works

1. Click the filter icon (🔽) in any column header
2. Select operator (for text/number columns)
3. Enter/select filter value
4. Filter applies automatically
5. Active filters shown in badge at top
6. Click X on badge to clear all filters
7. Click X in filter popover to clear individual filter

---

## 📊 Column Management

### Features

- **Show/hide columns** dynamically
- **Column visibility toggle** with switch controls
- **Show All / Hide All** quick actions
- **Visual column count** indicator
- **Persistent state** during session
- **Drag indicator** for future drag-to-reorder support

### Usage

```tsx
<EnhancedDataTable
  columns={columns}
  data={data}
  enableColumnManagement  // Enable column management
/>
```

### Example

```tsx
<EnhancedDataTable
  columns={columns}
  data={data}
  enableColumnManagement
/>
```

### How It Works

1. Click the column icon (⚏) in the toolbar
2. Dialog opens showing all columns
3. Toggle switches to show/hide columns
4. Use "Show All" or "Hide All" for bulk actions
5. Changes apply immediately
6. Close dialog when done

### Column Management Dialog

The dialog shows:
- **Column label** - Display name
- **Column ID** - Technical identifier
- **Toggle switch** - Show/hide control
- **Drag indicator** - Visual indicator (drag-to-reorder coming soon)
- **Counter** - "X of Y columns visible"

---

## 🎯 Combined Usage

Use both features together for maximum power:

```tsx
<EnhancedDataTable
  columns={columns}
  data={data}
  
  // Enable both features
  enableColumnFilters
  enableColumnManagement
  
  // Other props
  searchable
  selectable
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

## 📝 Complete Example

```tsx
"use client";
import { useState, useMemo } from 'react';
import { EnhancedDataTable } from '@/components';
import type { Column } from '@/components';

interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const columns: Column<User>[] = useMemo(() => [
    { 
      id: 'name', 
      label: 'Name', 
      type: 'text',
      sortable: true,
      filterable: true,
    },
    { 
      id: 'email', 
      label: 'Email', 
      type: 'text',
      sortable: true,
      filterable: true,
    },
    { 
      id: 'age', 
      label: 'Age', 
      type: 'number',
      sortable: true,
      filterable: true,
    },
    { 
      id: 'role', 
      label: 'Role', 
      type: 'chip',
      sortable: true,
      filterable: true,
    },
    { 
      id: 'active', 
      label: 'Active', 
      type: 'boolean',
      sortable: true,
      filterable: true,
    },
    { 
      id: 'createdAt', 
      label: 'Created Date', 
      type: 'date',
      sortable: true,
      filterable: true,
    },
  ], []);

  return (
    <EnhancedDataTable
      columns={columns}
      data={users}
      
      // Enable new features
      enableColumnFilters
      enableColumnManagement
      
      // Other features
      searchable
      selectable
      showPagination
      rowsPerPage={10}
      
      // Actions
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
    />
  );
}
```

---

## 🎨 UI/UX Details

### Toolbar Layout

```
[Search Input] [Active Filters Badge] [Selected Count] [Spacer] [Column Management Button]
```

### Filter Icon States

- **Gray** - No filter applied
- **Blue** - Filter active on this column
- **Hover** - Shows tooltip "Filter"

### Active Filters Badge

- Shows count: "1 filter active" or "3 filters active"
- Click X to clear all filters
- Only visible when filters are active

### Column Management Button

- Icon: ⚏ (ViewColumn)
- Tooltip: "Manage Columns"
- Opens dialog on click

---

## 🔧 Advanced Usage

### Programmatic Filter Control

While the component manages filters internally, you can:

1. **Disable filtering for specific columns**:
```tsx
{ id: 'actions', label: 'Actions', filterable: false }
```

2. **Customize column types for better filtering**:
```tsx
{ id: 'status', label: 'Status', type: 'chip' }  // Dropdown filter
{ id: 'price', label: 'Price', type: 'number' }  // Number operators
```

### Column Visibility Persistence

To persist column visibility across sessions:

```tsx
const [visibleColumns, setVisibleColumns] = useState(() => {
  const saved = localStorage.getItem('tableColumns');
  return saved ? JSON.parse(saved) : columns.map(c => c.id);
});

// Save on change
useEffect(() => {
  localStorage.setItem('tableColumns', JSON.stringify(visibleColumns));
}, [visibleColumns]);
```

---

## 🎯 Use Cases

### 1. User Management
- Filter by role (Admin, User, Manager)
- Filter by active status (Yes/No)
- Hide sensitive columns (email, phone)

### 2. Product Catalog
- Filter by price range (>, <, =)
- Filter by category (dropdown)
- Filter by availability (boolean)
- Hide internal columns (SKU, cost)

### 3. Order Management
- Filter by status (Pending, Shipped, Delivered)
- Filter by date range
- Filter by amount (>, <)
- Hide completed orders

### 4. Analytics Dashboard
- Filter by date range
- Filter by metrics (>, <)
- Show/hide different metric columns
- Compare different time periods

---

## 💡 Tips & Best Practices

### 1. Set Appropriate Column Types
```tsx
// ✅ Good - Correct types for better filtering
{ id: 'price', label: 'Price', type: 'number' }
{ id: 'status', label: 'Status', type: 'chip' }
{ id: 'active', label: 'Active', type: 'boolean' }

// ❌ Bad - Everything as text
{ id: 'price', label: 'Price', type: 'text' }
```

### 2. Make Important Columns Filterable
```tsx
// ✅ Good - Key columns are filterable
{ id: 'name', label: 'Name', filterable: true }
{ id: 'status', label: 'Status', filterable: true }
{ id: 'actions', label: 'Actions', filterable: false }

// ❌ Bad - Action columns filterable
{ id: 'actions', label: 'Actions', filterable: true }
```

### 3. Use Meaningful Column Labels
```tsx
// ✅ Good - Clear labels
{ id: 'createdAt', label: 'Created Date', type: 'date' }

// ❌ Bad - Technical labels
{ id: 'createdAt', label: 'createdAt', type: 'date' }
```

### 4. Provide Default Visible Columns
```tsx
// For tables with many columns, hide less important ones by default
const defaultVisibleColumns = ['name', 'email', 'status', 'createdAt'];
```

---

## 🐛 Troubleshooting

### Filters Not Working

**Problem**: Filters don't seem to work
**Solution**: 
- Check column type matches data type
- Ensure `filterable` is not set to `false`
- Verify data has values for that column

### Column Management Not Showing

**Problem**: Column management button not visible
**Solution**: 
- Ensure `enableColumnManagement={true}`
- Check if toolbar is visible

### Filter Values Not Showing in Dropdown

**Problem**: Select/Chip filter dropdown is empty
**Solution**: 
- Ensure data has values for that column
- Check for null/undefined values
- Verify column type is 'chip' or 'select'

---

## 🚀 Performance

Both features are optimized for performance:

- **Memoized calculations** - Filters and column visibility
- **Efficient filtering** - Only processes visible data
- **Lazy rendering** - Filter popovers only render when opened
- **Debounced updates** - Text filters update smoothly

### Performance Tips

1. **Use appropriate column types** - Better filtering performance
2. **Limit visible columns** - Faster rendering
3. **Use pagination** - Don't render all rows at once
4. **Memoize columns** - Prevent unnecessary re-renders

```tsx
const columns = useMemo(() => [...], []); // ✅ Good
const columns = [...]; // ❌ Bad - recreates every render
```

---

## 📊 Comparison with Other Solutions

| Feature | EnhancedDataTable | Material-UI Table | AG Grid | React Table |
|---------|-------------------|-------------------|---------|-------------|
| Column Filters | ✅ Built-in | ❌ Manual | ✅ Built-in | ⚠️ Plugin |
| Column Management | ✅ Built-in | ❌ Manual | ✅ Built-in | ⚠️ Plugin |
| Easy Setup | ✅ 2 props | ❌ Complex | ⚠️ Moderate | ⚠️ Moderate |
| TypeScript | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Bundle Size | ✅ Small | ✅ Small | ❌ Large | ✅ Small |
| Learning Curve | ✅ Easy | ⚠️ Moderate | ❌ Steep | ⚠️ Moderate |

---

## 🎓 Migration from Old Version

If you're using the old EnhancedDataTable without these features:

### Before
```tsx
<EnhancedDataTable
  columns={columns}
  data={data}
  searchable
/>
```

### After
```tsx
<EnhancedDataTable
  columns={columns}
  data={data}
  searchable
  enableColumnFilters      // Add this
  enableColumnManagement   // Add this
/>
```

That's it! No breaking changes, fully backward compatible.

---

## 🎉 Summary

You now have:
- ✅ **Excel-like filtering** on every column
- ✅ **Column show/hide** management
- ✅ **Active filter badges** for visibility
- ✅ **Multiple filter operators** for flexibility
- ✅ **Easy to use** - just 2 props
- ✅ **Fully typed** with TypeScript
- ✅ **Production ready** and tested

Try it out on the `/example-page` to see it in action!

---

**Happy filtering!** 🎯

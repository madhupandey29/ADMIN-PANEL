# Filter Pages Upgrade Guide

## Overview
This guide shows you how to upgrade all 23 filter pages to use the new EnhancedDataTable with better UI, without affecting your existing code logic.

## What's New?
✅ **EnhancedDataTable** - Advanced filtering, sorting, column management
✅ **Better UI** - Modern design matching SEO page
✅ **Flexible Configuration** - Each filter can have different fields
✅ **Feature Control** - Enable/disable add, edit, delete, view per filter
✅ **Image Support** - Automatic handling for filters with images
✅ **No Code Duplication** - One component, 23 configurations

## Architecture

### Files Created:
1. `src/components/GenericFilterPage/types.ts` - Type definitions
2. `src/components/GenericFilterPage/index.tsx` - Main component
3. `src/components/GenericFilterPage/FilterFormDialog.tsx` - Form dialog
4. `src/config/filterConfigs.tsx` - Configuration for each filter

## How to Use

### Step 1: Define Configuration

In `src/config/filterConfigs.tsx`, add configuration for each filter:

```typescript
export const yourFilterConfig: FilterConfig = {
  name: 'YourFilter',
  namePlural: 'YourFilters',
  apiEndpoint: '/your-filter',
  icon: <YourIcon />,
  
  // Define form fields
  fields: [
    {
      name: 'name',
      label: 'Name',
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
      name: 'image',
      label: 'Image',
      type: 'image',
    },
  ],
  
  // Define table columns
  columns: [
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      filterable: true,
    },
  ],
  
  // Control features
  features: {
    hasImage: true,      // Has image upload
    hasAdd: true,        // Can add new items
    hasEdit: true,       // Can edit items
    hasDelete: true,     // Can delete items
    hasView: false,      // Has view dialog
    hasExport: true,     // Can export data
    hasSearch: true,     // Has search functionality
  },
};
```

### Step 2: Update Page File

Replace your existing page with just 3 lines:

```typescript
"use client";
import GenericFilterPage from '@/components/GenericFilterPage';
import { yourFilterConfig } from '@/config/filterConfigs';

export default function YourFilterPage() {
  return <GenericFilterPage config={yourFilterConfig} />;
}
```

## Field Types Supported

### Text Fields
```typescript
{
  name: 'name',
  label: 'Name',
  type: 'text',
  required: true,
  placeholder: 'Enter name...',
  helperText: 'This is a helper text',
}
```

### Textarea
```typescript
{
  name: 'description',
  label: 'Description',
  type: 'textarea',
  rows: 4,
  multiline: true,
}
```

### Image Upload
```typescript
{
  name: 'image',
  label: 'Image',
  type: 'image',
  accept: 'image/*',
  helperText: 'Recommended: 800x800px',
}
```

### Number
```typescript
{
  name: 'price',
  label: 'Price',
  type: 'number',
}
```

### Select Dropdown
```typescript
{
  name: 'status',
  label: 'Status',
  type: 'select',
  options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
}
```

### Email
```typescript
{
  name: 'email',
  label: 'Email',
  type: 'email',
}
```

### URL
```typescript
{
  name: 'website',
  label: 'Website',
  type: 'url',
}
```

## Examples for Your 23 Filters

### Simple Filters (Name only)
For filters like Color, Vendor, Groupcode, Motif:

```typescript
export const colorConfig: FilterConfig = {
  name: 'Color',
  namePlural: 'Colors',
  apiEndpoint: '/color',
  icon: <PaletteIcon />,
  fields: [
    { name: 'name', label: 'Color Name', type: 'text', required: true }
  ],
  columns: [
    { id: 'name', label: 'Color Name', sortable: true, filterable: true }
  ],
  features: {
    hasImage: false,
    hasAdd: true,
    hasEdit: true,
    hasDelete: true,
  },
};
```

### Filters with Images
For filters like Category, Design:

```typescript
export const categoryConfig: FilterConfig = {
  name: 'Category',
  namePlural: 'Categories',
  apiEndpoint: '/category',
  icon: <CategoryIcon />,
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'image', label: 'Image', type: 'image' },
    { name: 'altimg', label: 'Alt Text', type: 'text' },
  ],
  columns: [
    { id: 'image', label: 'Image', type: 'image', format: (v, row) => row.image },
    { id: 'name', label: 'Name', sortable: true, filterable: true },
  ],
  features: {
    hasImage: true,
    hasAdd: true,
    hasEdit: true,
    hasDelete: true,
  },
};
```

### Read-Only Filters (Edit & Delete only)
For filters that shouldn't allow adding new items:

```typescript
export const readOnlyConfig: FilterConfig = {
  // ... other config
  features: {
    hasAdd: false,      // Disable add button
    hasEdit: true,      // Allow editing
    hasDelete: true,    // Allow deleting
  },
};
```

## Migration Steps

### For Each Filter Page:

1. **Backup** your current page file (rename to `page-old.tsx`)
2. **Add configuration** to `src/config/filterConfigs.tsx`
3. **Create new page** with 3 lines of code
4. **Test** the functionality
5. **Delete** old file once confirmed working

### Example Migration:

**Before** (category/page.tsx - 800+ lines):
```typescript
// 800+ lines of code with state management, API calls, forms, etc.
```

**After** (category/page.tsx - 3 lines):
```typescript
"use client";
import GenericFilterPage from '@/components/GenericFilterPage';
import { categoryConfig } from '@/config/filterConfigs';

export default function CategoryPage() {
  return <GenericFilterPage config={categoryConfig} />;
}
```

## Advanced Features

### Custom Validation
```typescript
export const config: FilterConfig = {
  // ... other config
  validate: (data) => {
    if (data.name.length < 3) {
      return 'Name must be at least 3 characters';
    }
    return null; // No error
  },
};
```

### Custom Data Transformation
```typescript
export const config: FilterConfig = {
  // ... other config
  transformData: (items) => {
    return items.map(item => ({
      ...item,
      displayName: item.name.toUpperCase(),
    }));
  },
};
```

### Custom Format Before Submit
```typescript
export const config: FilterConfig = {
  // ... other config
  formatBeforeSubmit: (data) => {
    const formData = new FormData();
    formData.append('name', data.name.trim());
    // Add custom logic
    return formData;
  },
};
```

## Benefits

### Before:
- ❌ 800+ lines per filter page
- ❌ Duplicate code across 23 pages
- ❌ Hard to maintain consistency
- ❌ No advanced filtering/sorting
- ❌ Basic UI

### After:
- ✅ 3 lines per filter page
- ✅ Single source of truth
- ✅ Easy to maintain
- ✅ Advanced filtering, sorting, column management
- ✅ Modern UI matching SEO page
- ✅ ~95% less code

## Your 23 Filters

Here's the list to migrate:

1. ✅ Category (with image)
2. ⬜ Color (simple)
3. ⬜ Content (simple)
4. ⬜ Design (with image)
5. ⬜ Finish (simple)
6. ⬜ Subfinish (simple)
7. ⬜ Structure (simple)
8. ⬜ Substructure (simple)
9. ⬜ Suitablefor (simple)
10. ⬜ Subsuitable (simple)
11. ⬜ Vendor (simple)
12. ⬜ Groupcode (simple)
13. ⬜ Motif (simple)
14. ⬜ Country (simple)
15. ⬜ State (simple)
16. ⬜ City (simple)
17. ⬜ Location (simple)
18. ⬜ Location Details (complex)
19. ⬜ Office Information (complex)
20. ⬜ About Us (complex)
21. ⬜ Blog (complex)
22. ⬜ Shofy Users (complex)
23. ⬜ Contact (complex)

## Testing Checklist

For each migrated filter:
- [ ] Can view list of items
- [ ] Can search/filter items
- [ ] Can sort columns
- [ ] Can add new item
- [ ] Can edit existing item
- [ ] Can delete item
- [ ] Image upload works (if applicable)
- [ ] Export works
- [ ] Permissions work (view-only mode)

## Need Help?

If you encounter any issues:
1. Check the configuration syntax
2. Verify API endpoint is correct
3. Ensure field names match your database
4. Test with simple config first
5. Add features incrementally

## Next Steps

1. Start with simple filters (Color, Vendor, etc.)
2. Test thoroughly
3. Move to filters with images
4. Finally, handle complex filters with custom logic

Your existing code logic is preserved - this just provides a better UI layer on top!

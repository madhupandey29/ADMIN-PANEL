# 🚀 Quick Reference Guide

## EnhancedDataTable - Essential Props

```tsx
<EnhancedDataTable
  columns={columns}              // Required: Column definitions
  data={data}                    // Required: Array of data
  loading={false}                // Show loading skeletons
  
  // Actions (all optional)
  onEdit={(row) => {}}          // Edit button handler
  onDelete={(row) => {}}        // Delete button handler
  onView={(row) => {}}          // View button handler
  customActions={[]}            // Additional custom actions
  
  // Features
  searchable={true}             // Enable search
  selectable={false}            // Enable row selection
  showPagination={true}         // Show pagination
  rowsPerPage={10}              // Items per page
  
  // Styling
  dense={false}                 // Compact mode
  stickyHeader={true}           // Sticky table header
  
  // Callbacks
  onRowClick={(row) => {}}      // Row click handler
  onSelectionChange={(rows) => {}} // Selection change handler
  getRowId={(row) => row._id}   // Custom row ID getter
/>
```

## Column Definition

```tsx
const columns: Column[] = [
  {
    id: 'fieldName',           // Required: Field name in data
    label: 'Display Name',     // Required: Column header
    type: 'text',              // Optional: text|number|date|boolean|image|chip|custom
    sortable: true,            // Optional: Enable sorting (default: true)
    filterable: true,          // Optional: Include in search (default: true)
    align: 'left',             // Optional: left|right|center
    minWidth: 100,             // Optional: Minimum column width
    format: (value, row) => {} // Optional: Custom formatter
  }
];
```

## EnhancedFormDialog - Essential Props

```tsx
<EnhancedFormDialog
  open={open}                   // Required: Dialog open state
  onClose={() => {}}            // Required: Close handler
  onSubmit={async (data) => {}} // Required: Submit handler
  title="Form Title"            // Required: Dialog title
  
  // Form definition (use one)
  fields={fields}               // Simple form: array of fields
  sections={sections}           // Complex form: grouped sections
  
  // Data
  initialData={{}}              // Pre-fill form data
  
  // Customization
  maxWidth="md"                 // xs|sm|md|lg|xl
  submitLabel="Submit"          // Submit button text
  cancelLabel="Cancel"          // Cancel button text
  validateOnChange={false}      // Validate on field change
  loading={false}               // Disable form during loading
/>
```

## Field Definition

```tsx
const fields: FormField[] = [
  {
    name: 'fieldName',         // Required: Field name
    label: 'Field Label',      // Required: Field label
    type: 'text',              // Required: Field type (see below)
    required: false,           // Optional: Required field
    placeholder: '',           // Optional: Placeholder text
    helperText: '',            // Optional: Help text
    defaultValue: '',          // Optional: Default value
    disabled: false,           // Optional: Disable field
    
    // Grid layout (optional)
    gridSize: { xs: 12, md: 6 },
    
    // Conditional display (optional)
    showIf: (formData) => true,
    
    // Custom validation (optional)
    validation: (value) => null, // Return error string or null
    
    // Change handler (optional)
    onChange: (value, formData) => {},
    
    // Custom render (optional)
    render: (value, onChange, formData) => <Component />
  }
];
```

## Field Types Quick Reference

| Type | Description | Extra Props |
|------|-------------|-------------|
| `text` | Text input | `placeholder` |
| `number` | Number input | `min`, `max`, `step` |
| `email` | Email input | - |
| `password` | Password input | - |
| `textarea` | Multi-line text | `rows` |
| `select` | Dropdown | `options` |
| `multiselect` | Multi-select dropdown | `options` |
| `autocomplete` | Searchable dropdown | `options` |
| `checkbox` | Checkbox | - |
| `switch` | Toggle switch | - |
| `date` | Date picker | - |
| `datetime-local` | Date & time picker | - |
| `time` | Time picker | - |
| `file` | File upload | `accept` |
| `image` | Image upload with preview | `accept` |
| `color` | Color picker | - |
| `url` | URL input | - |
| `tel` | Phone input | - |
| `custom` | Custom component | `render` |

## Common Patterns

### 1. Simple CRUD Page

```tsx
const columns = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
];

const fields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
];

<EnhancedDataTable 
  columns={columns} 
  data={data}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

<EnhancedFormDialog
  open={open}
  onClose={handleClose}
  onSubmit={handleSubmit}
  title="Add Item"
  fields={fields}
/>
```

### 2. With Image Upload

```tsx
const fields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'image', label: 'Image', type: 'image', accept: 'image/*' },
];

const handleSubmit = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  await fetch('/api/endpoint', { method: 'POST', body: formData });
};
```

### 3. With Conditional Fields

```tsx
const fields = [
  { name: 'hasDiscount', label: 'Has Discount', type: 'checkbox' },
  {
    name: 'discount',
    label: 'Discount %',
    type: 'number',
    showIf: (data) => data.hasDiscount === true
  },
];
```

### 4. With Custom Validation

```tsx
const fields = [
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    validation: (value) => {
      if (value.length < 8) return 'Min 8 characters';
      if (!/[A-Z]/.test(value)) return 'Need uppercase';
      return null;
    }
  },
];
```

### 5. With Form Sections

```tsx
const sections = [
  {
    title: 'Basic Info',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
    ]
  },
  {
    title: 'Contact',
    fields: [
      { name: 'email', label: 'Email', type: 'email' },
    ]
  },
];
```

### 6. With Custom Actions

```tsx
const customActions = [
  {
    icon: <DownloadIcon />,
    label: 'Download',
    onClick: (row) => downloadFile(row),
    color: 'primary',
    show: (row) => row.hasFile, // Conditional
  },
];

<EnhancedDataTable
  columns={columns}
  data={data}
  customActions={customActions}
/>
```

### 7. With Row Selection

```tsx
const [selected, setSelected] = useState([]);

<EnhancedDataTable
  columns={columns}
  data={data}
  selectable
  onSelectionChange={setSelected}
/>

{selected.length > 0 && (
  <Button onClick={() => bulkDelete(selected)}>
    Delete {selected.length} items
  </Button>
)}
```

## Import Statements

```tsx
// Components
import { EnhancedDataTable, EnhancedFormDialog } from '@/components';

// Types
import type { Column, Action, FormField, FormSection } from '@/components';

// Individual imports
import { EnhancedDataTable } from '@/components/DataTable';
import { EnhancedFormDialog } from '@/components/FormDialog';
```

## TypeScript Tips

```tsx
// Define your data interface
interface Product {
  _id: string;
  name: string;
  price: number;
}

// Use generic types
const columns: Column<Product>[] = [...];
const customActions: Action<Product>[] = [...];

// Type-safe handlers
const handleEdit = (product: Product) => {
  // product is fully typed
};
```

## Performance Tips

```tsx
// ✅ Memoize columns and fields
const columns = useMemo(() => [...], []);
const fields = useMemo(() => [...], []);

// ✅ Use callbacks for handlers
const handleEdit = useCallback((row) => {...}, []);

// ✅ Implement pagination for large datasets
<EnhancedDataTable rowsPerPage={10} />

// ✅ Show loading states
<EnhancedDataTable loading={isLoading} />
```

## Common Gotchas

1. **Images not showing**: Use absolute URLs or configure Next.js image domains
2. **Form not submitting**: Check validation errors in console
3. **Table not sorting**: Ensure data values are comparable (same type)
4. **Selection not working**: Provide unique `getRowId` function
5. **Validation not triggering**: Set `validateOnChange={true}` or check validation function

## Need Help?

- See [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) for detailed examples
- Check [README.md](./README.md) for component overview
- Visit `/example-page` in your app for live demo
- Review component source code for advanced customization

---

**Quick Start**: Copy a pattern above, adjust field names, and you're done! 🚀
